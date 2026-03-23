<script lang="ts">
	import { WASTE_TYPES, DEFAULT_FILTERS, DUTCH_MONTHS, DUTCH_DAYS } from '$lib/types';
	import type { WasteEntry } from '$lib/types';

	let postcode = $state('');
	let housenumber = $state('');
	let suffix = $state('');
	let loading = $state(false);
	let error = $state('');
	let calendarData = $state<WasteEntry[]>([]);
	let hasSearched = $state(false);
	let activeFilters = $state<Set<string>>(new Set(DEFAULT_FILTERS));
	let showExportModal = $state(false);

	const today = new Date();
	let viewMonth = $state(today.getMonth());
	let viewYear = $state(today.getFullYear());

	let dataByDate = $derived.by(() => {
		const map = new Map<string, WasteEntry[]>();
		for (const entry of calendarData) {
			const key = entry.date;
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(entry);
		}
		return map;
	});

	let discoveredTypes = $derived.by(() => {
		const types = new Set<string>();
		for (const entry of calendarData) {
			if (WASTE_TYPES[entry.type]) types.add(entry.type);
		}
		return [...types].sort();
	});

	let calendarGrid = $derived.by(() => {
		const first = new Date(viewYear, viewMonth, 1);
		const last = new Date(viewYear, viewMonth + 1, 0);

		let startPad = first.getDay() - 1;
		if (startPad < 0) startPad = 6;

		const days: (number | null)[] = [];
		for (let i = 0; i < startPad; i++) days.push(null);
		for (let d = 1; d <= last.getDate(); d++) days.push(d);
		while (days.length % 7 !== 0) days.push(null);

		return days;
	});

	let upcoming = $derived.by(() => {
		const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());
		return calendarData
			.filter((e) => e.date >= todayStr && activeFilters.has(e.type) && WASTE_TYPES[e.type])
			.sort((a, b) => a.date.localeCompare(b.date))
			.slice(0, 10);
	});

	let filteredData = $derived.by(() => {
		return calendarData.filter((e) => activeFilters.has(e.type) && WASTE_TYPES[e.type]);
	});

	function formatDate(y: number, m: number, d: number): string {
		return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
	}

	function isToday(day: number): boolean {
		return (
			day === today.getDate() &&
			viewMonth === today.getMonth() &&
			viewYear === today.getFullYear()
		);
	}

	function getEntriesForDay(day: number): WasteEntry[] {
		const key = formatDate(viewYear, viewMonth, day);
		return (dataByDate.get(key) || []).filter(
			(e) => activeFilters.has(e.type) && WASTE_TYPES[e.type]
		);
	}

	function prevMonth() {
		if (viewMonth === 0) {
			viewMonth = 11;
			viewYear--;
		} else {
			viewMonth--;
		}
	}

	function nextMonth() {
		if (viewMonth === 11) {
			viewMonth = 0;
			viewYear++;
		} else {
			viewMonth++;
		}
	}

	function toggleFilter(type: string) {
		const next = new Set(activeFilters);
		if (next.has(type)) {
			next.delete(type);
		} else {
			next.add(type);
		}
		activeFilters = next;
	}

	function formatDisplayDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		const dayNames = [
			'zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'
		];
		return `${dayNames[d.getDay()]} ${d.getDate()} ${DUTCH_MONTHS[d.getMonth()]}`;
	}

	function getExportUrl(): string {
		const params = new URLSearchParams({
			postcode: postcode.trim(),
			housenumber: housenumber.trim()
		});
		if (suffix.trim()) params.set('suffix', suffix.trim());
		const types = [...activeFilters].join(',');
		if (types) params.set('types', types);
		return `/api/calendar/export?${params}`;
	}

	function exportApple() {
		// Direct .ics download - iOS/macOS will prompt "Add events to Calendar"
		window.location.href = getExportUrl();
		showExportModal = false;
	}

	function exportDownload() {
		window.open(getExportUrl(), '_blank');
		showExportModal = false;
	}

	function exportGoogle() {
		// Google Calendar can import .ics via URL
		const fullUrl = `${window.location.origin}${getExportUrl()}`;
		window.open(getExportUrl(), '_blank');
		showExportModal = false;
	}

	function exportOutlook() {
		window.open(getExportUrl(), '_blank');
		showExportModal = false;
	}

	async function search() {
		if (!postcode.trim() || !housenumber.trim()) return;

		loading = true;
		error = '';
		calendarData = [];

		try {
			const res = await fetch('/api/calendar', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					postcode: postcode.trim(),
					housenumber: housenumber.trim(),
					suffix: suffix.trim() || undefined
				})
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Er ging iets mis';
				return;
			}

			calendarData = data.calendar;
			hasSearched = true;

			if (data.calendar.length) {
				const allTypes = new Set<string>();
				for (const e of data.calendar) {
					if (WASTE_TYPES[e.type]) allTypes.add(e.type);
				}
				// Start with defaults that exist in data, fallback to all types
				const filters = new Set(DEFAULT_FILTERS.filter((t) => allTypes.has(t)));
				if (filters.size === 0) {
					for (const t of allTypes) filters.add(t);
				}
				activeFilters = filters;
			}
		} catch {
			error = 'Kan geen verbinding maken met de server';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>De Goeie Afvalwijzer - Groningen</title>
	<meta name="description" content="Afvalkalender voor gemeente Groningen" />
</svelte:head>

<main>
	<header>
		<div class="header-inner">
			<h1>De Goeie<br /><span>Afvalwijzer</span></h1>
			<p class="subtitle">Gemeente Groningen</p>
		</div>
		<div class="header-accent"></div>
	</header>

	<section class="search-section">
		<form onsubmit={(e) => { e.preventDefault(); search(); }}>
			<div class="form-row">
				<div class="field field-postcode">
					<label for="postcode">Postcode</label>
					<input
						id="postcode"
						type="text"
						bind:value={postcode}
						placeholder="9711 AA"
						maxlength="7"
						autocomplete="postal-code"
					/>
				</div>
				<div class="field field-nr">
					<label for="housenumber">Nr.</label>
					<input
						id="housenumber"
						type="text"
						bind:value={housenumber}
						placeholder="1"
						maxlength="6"
					/>
				</div>
				<div class="field field-suffix">
					<label for="suffix">Toev.</label>
					<input
						id="suffix"
						type="text"
						bind:value={suffix}
						placeholder="A"
						maxlength="6"
					/>
				</div>
				<button
					type="submit"
					class="btn-search"
					disabled={loading || !postcode.trim() || !housenumber.trim()}
				>
					{#if loading}
						<span class="spinner"></span>
					{:else}
						Zoek
					{/if}
				</button>
			</div>
		</form>

		{#if error}
			<div class="error-msg">{error}</div>
		{/if}
	</section>

	{#if hasSearched && !error}
		<section class="filters-section">
			<div class="filters-row">
				<div>
					<h2>Afvaltype</h2>
					<div class="filter-pills">
						{#each discoveredTypes as type}
							{@const config = WASTE_TYPES[type]}
							<button
								class="filter-pill"
								class:active={activeFilters.has(type)}
								style="--pill-color: {config.color}; --pill-bg: {config.bg}"
								onclick={() => toggleFilter(type)}
							>
								<span class="pill-icon" style="background: {config.color}">
									<svg viewBox="0 0 24 24" fill="none">
										<path d={config.icon} stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
								</span>
								{config.label}
							</button>
						{/each}
					</div>
				</div>
				<button class="btn-export" onclick={() => (showExportModal = true)}>
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path d="M9 3v8m0 0L6 8m3 3l3-3M3 13v1a1 1 0 001 1h10a1 1 0 001-1v-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Exporteer
				</button>
			</div>
		</section>

		<div class="content-layout">
			<section class="calendar-section">
				<div class="calendar-nav">
					<button class="nav-btn" onclick={prevMonth} aria-label="Vorige maand">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M12 15L7 10L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<h3>{DUTCH_MONTHS[viewMonth]} {viewYear}</h3>
					<button class="nav-btn" onclick={nextMonth} aria-label="Volgende maand">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>

				<div class="calendar-grid">
					{#each DUTCH_DAYS as day}
						<div class="day-header">{day}</div>
					{/each}

					{#each calendarGrid as day}
						{#if day === null}
							<div class="day-cell empty"></div>
						{:else}
							{@const entries = getEntriesForDay(day)}
							<div
								class="day-cell"
								class:today={isToday(day)}
								class:has-entries={entries.length > 0}
							>
								<span class="day-number">{day}</span>
								{#if entries.length > 0}
									<div class="day-icons">
										{#each entries as entry}
											{@const config = WASTE_TYPES[entry.type]}
											{#if config}
												<span
													class="waste-icon"
													style="background: {config.color}"
													title={config.label}
												>
													<svg viewBox="0 0 24 24" fill="none">
														<path d={config.icon} stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
													</svg>
												</span>
											{/if}
										{/each}
									</div>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</section>

			{#if upcoming.length > 0}
				<aside class="upcoming-section">
					<h2>Eerstvolgende ophaaldagen</h2>
					<ul class="upcoming-list">
						{#each upcoming as entry}
							{@const config = WASTE_TYPES[entry.type]}
							{#if config}
								<li class="upcoming-item">
									<span class="upcoming-icon" style="background: {config.color}">
										<svg viewBox="0 0 24 24" fill="none">
											<path d={config.icon} stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										</svg>
									</span>
									<div class="upcoming-info">
										<span class="upcoming-type">{config.label}</span>
										<span class="upcoming-date">{formatDisplayDate(entry.date)}</span>
									</div>
								</li>
							{/if}
						{/each}
					</ul>
				</aside>
			{/if}
		</div>
	{/if}

	{#if !hasSearched}
		<section class="empty-state">
			<div class="empty-icon">
				<svg width="64" height="64" viewBox="0 0 64 64" fill="none">
					<rect x="8" y="16" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
					<path d="M8 28H56" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
					<path d="M20 8V20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>
					<path d="M44 8V20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.3"/>
				</svg>
			</div>
			<p>Vul je postcode en huisnummer in<br />om je afvalkalender te bekijken</p>
		</section>
	{/if}
</main>

<!-- Export Modal -->
{#if showExportModal}
	<div class="modal-backdrop" onclick={() => (showExportModal = false)} role="presentation">
		<div class="modal" onclick={(e) => e.stopPropagation()} role="dialog" aria-label="Exporteer kalender">
			<div class="modal-header">
				<h3>Exporteer naar je kalender</h3>
				<button class="modal-close" onclick={() => (showExportModal = false)} aria-label="Sluiten">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					</svg>
				</button>
			</div>
			<p class="modal-desc">Kies je kalender-app om alle {filteredData.length} afspraken te importeren.</p>
			<div class="export-options">
				<button class="export-option" onclick={exportApple}>
					<div class="export-icon apple">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
						</svg>
					</div>
					<div class="export-text">
						<span class="export-name">Apple Kalender (iCal)</span>
						<span class="export-sub">Opent direct in Kalender-app</span>
					</div>
				</button>

				<button class="export-option" onclick={exportGoogle}>
					<div class="export-icon google">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M6 3h12l3 3v12l-3 3H6l-3-3V6l3-3z" fill="none" stroke="currentColor" stroke-width="1.5"/>
							<rect x="7" y="11" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.7"/>
							<rect x="13" y="11" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4"/>
							<rect x="7" y="7" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.5"/>
							<rect x="13" y="7" width="4" height="2" rx="0.5" fill="currentColor" opacity="0.3"/>
						</svg>
					</div>
					<div class="export-text">
						<span class="export-name">Google Agenda</span>
						<span class="export-sub">Download .ics, importeer via Instellingen</span>
					</div>
				</button>

				<button class="export-option" onclick={exportOutlook}>
					<div class="export-icon outlook">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
							<path d="M3 9h18" stroke="currentColor" stroke-width="1.5"/>
							<circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.5"/>
						</svg>
					</div>
					<div class="export-text">
						<span class="export-name">Outlook</span>
						<span class="export-sub">Download .ics bestand</span>
					</div>
				</button>

				<button class="export-option" onclick={exportDownload}>
					<div class="export-icon generic">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
							<path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
						</svg>
					</div>
					<div class="export-text">
						<span class="export-name">Andere app</span>
						<span class="export-sub">Download .ics (universeel)</span>
					</div>
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	main {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 20px 64px;
	}

	header {
		position: relative;
		padding: 40px 0 28px;
	}

	.header-inner {
		position: relative;
		z-index: 1;
	}

	h1 {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2.6rem;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--text);
	}

	h1 span {
		color: var(--accent);
	}

	.subtitle {
		margin-top: 6px;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.header-accent {
		position: absolute;
		top: 20px;
		right: -20px;
		width: 120px;
		height: 120px;
		background: linear-gradient(135deg, rgba(234, 88, 12, 0.08), rgba(234, 88, 12, 0.02));
		border-radius: 50%;
		pointer-events: none;
	}

	/* Search */
	.search-section {
		margin-bottom: 24px;
	}

	.form-row {
		display: flex;
		gap: 8px;
		align-items: flex-end;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.field-postcode { flex: 2.2; }
	.field-nr { flex: 1; }
	.field-suffix { flex: 1; }

	label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-muted);
	}

	input {
		height: 48px;
		padding: 0 14px;
		border: 2px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-card);
		font-family: var(--font-body);
		font-size: 1rem;
		font-weight: 500;
		color: var(--text);
		transition: border-color 0.15s;
	}

	input::placeholder { color: var(--border-strong); }
	input:focus { outline: none; border-color: var(--accent); }

	.btn-search {
		height: 48px;
		padding: 0 24px;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.15s, transform 0.1s;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 80px;
	}

	.btn-search:hover:not(:disabled) { background: var(--accent-hover); }
	.btn-search:active:not(:disabled) { transform: scale(0.97); }
	.btn-search:disabled { opacity: 0.5; cursor: not-allowed; }

	.spinner {
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 2.5px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.error-msg {
		margin-top: 12px;
		padding: 10px 14px;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: var(--radius-sm);
		color: #b91c1c;
		font-size: 0.875rem;
		font-weight: 500;
	}

	/* Filters row */
	.filters-section {
		margin-bottom: 20px;
	}

	.filters-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}

	.filters-section h2 {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 10px;
	}

	.filter-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.filter-pill {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border: 2px solid var(--border);
		border-radius: 100px;
		background: var(--bg-card);
		font-family: var(--font-body);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.15s;
	}

	.filter-pill:hover { border-color: var(--pill-color); }

	.filter-pill.active {
		background: var(--pill-bg);
		border-color: var(--pill-color);
		color: var(--pill-color);
	}

	.pill-icon {
		width: 18px;
		height: 18px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.4;
		transition: opacity 0.15s;
	}

	.pill-icon svg {
		width: 12px;
		height: 12px;
	}

	.filter-pill.active .pill-icon { opacity: 1; }

	/* Export button */
	.btn-export {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 9px 16px;
		border: 2px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg-card);
		font-family: var(--font-body);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text);
		cursor: pointer;
		transition: all 0.15s;
		white-space: nowrap;
		margin-top: 22px;
	}

	.btn-export:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	/* Content layout: calendar + upcoming side by side */
	.content-layout {
		display: flex;
		gap: 20px;
		align-items: flex-start;
	}

	.calendar-section {
		background: var(--bg-card);
		border: 2px solid var(--border);
		border-radius: var(--radius);
		padding: 20px;
		flex: 1;
		min-width: 0;
	}

	.calendar-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.calendar-nav h3 {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 600;
		text-transform: capitalize;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: 2px solid var(--border);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--text);
		cursor: pointer;
		transition: all 0.15s;
	}

	.nav-btn:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	.day-header {
		text-align: center;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--text-muted);
		padding-bottom: 8px;
	}

	.day-cell {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2px;
		border-radius: var(--radius-sm);
		position: relative;
		transition: background 0.1s;
		padding: 2px;
	}

	.day-cell.empty { pointer-events: none; }
	.day-cell.has-entries { background: #fafaf9; }

	.day-cell.today {
		outline: 2px solid var(--accent);
		outline-offset: -1px;
	}

	.day-number {
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--text);
		line-height: 1;
	}

	.day-icons {
		display: flex;
		gap: 2px;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 100%;
	}

	.waste-icon {
		width: 22px;
		height: 22px;
		border-radius: 4px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.waste-icon svg {
		width: 14px;
		height: 14px;
	}

	/* Upcoming sidebar */
	.upcoming-section {
		width: 280px;
		flex-shrink: 0;
	}

	.upcoming-section h2 {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 10px;
	}

	.upcoming-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.upcoming-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		background: var(--bg-card);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
	}

	.upcoming-icon {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upcoming-icon svg {
		width: 18px;
		height: 18px;
	}

	.upcoming-info {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}

	.upcoming-type {
		font-weight: 600;
		font-size: 0.82rem;
	}

	.upcoming-date {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--text-muted);
	}

	.empty-icon {
		margin-bottom: 16px;
		color: var(--border-strong);
	}

	.empty-state p {
		font-size: 0.95rem;
		line-height: 1.6;
	}

	/* Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		padding: 20px;
		animation: fadeIn 0.15s ease;
	}

	.modal {
		background: var(--bg-card);
		border-radius: 14px;
		padding: 28px;
		width: 100%;
		max-width: 420px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
		animation: slideUp 0.2s ease;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.modal-header h3 {
		font-family: var(--font-display);
		font-size: 1.2rem;
		font-weight: 700;
	}

	.modal-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.15s;
	}

	.modal-close:hover {
		background: var(--border);
		color: var(--text);
	}

	.modal-desc {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: 20px;
	}

	.export-options {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.export-option {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg-card);
		cursor: pointer;
		transition: all 0.15s;
		text-align: left;
		font-family: var(--font-body);
	}

	.export-option:hover {
		border-color: var(--accent);
		background: #fffbf7;
	}

	.export-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 10px;
		flex-shrink: 0;
	}

	.export-icon.apple {
		background: #f3f4f6;
		color: #1a1a1a;
	}

	.export-icon.google {
		background: #e8f0fe;
		color: #1a73e8;
	}

	.export-icon.outlook {
		background: #e5f1fb;
		color: #0078d4;
	}

	.export-icon.generic {
		background: #fef3e2;
		color: var(--accent);
	}

	.export-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.export-name {
		font-weight: 600;
		font-size: 0.9rem;
		color: var(--text);
	}

	.export-sub {
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(12px) scale(0.97); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	/* Responsive - Tablet */
	@media (max-width: 720px) {
		.content-layout {
			flex-direction: column;
		}

		.upcoming-section {
			width: 100%;
		}
	}

	/* Responsive - Mobile */
	@media (max-width: 480px) {
		main {
			padding: 0 12px 48px;
		}

		header {
			padding: 24px 0 18px;
		}

		h1 {
			font-size: 1.8rem;
		}

		.subtitle {
			font-size: 0.75rem;
		}

		.header-accent {
			width: 60px;
			height: 60px;
			top: 10px;
			right: 0px;
		}

		/* Form: grid on mobile - inputs on row 1, button full width row 2 */
		.form-row {
			display: grid;
			grid-template-columns: 5fr 3fr 2fr;
			gap: 6px;
		}

		.btn-search {
			grid-column: 1 / -1;
			min-width: unset;
			height: 44px;
		}

		input {
			height: 44px;
			padding: 0 10px;
			font-size: 0.95rem;
			min-width: 0;
			width: 100%;
		}

		.field {
			min-width: 0;
		}

		label {
			font-size: 0.68rem;
		}

		/* Filters */
		.filters-row {
			flex-direction: column;
			gap: 10px;
		}

		.filters-section h2 {
			font-size: 0.72rem;
			margin-bottom: 8px;
		}

		.filter-pills {
			gap: 5px;
		}

		.filter-pill {
			padding: 6px 10px;
			font-size: 0.75rem;
			gap: 5px;
		}

		.pill-icon {
			width: 16px;
			height: 16px;
		}

		.pill-icon svg {
			width: 10px;
			height: 10px;
		}

		.btn-export {
			margin-top: 0;
			width: 100%;
			justify-content: center;
			padding: 10px 16px;
		}

		/* Calendar */
		.calendar-section {
			padding: 12px;
			border-radius: 8px;
		}

		.calendar-nav {
			margin-bottom: 12px;
		}

		.calendar-nav h3 {
			font-size: 1.05rem;
		}

		.nav-btn {
			width: 34px;
			height: 34px;
		}

		.day-header {
			font-size: 0.65rem;
			padding-bottom: 6px;
		}

		.day-cell {
			gap: 2px;
			border-radius: 4px;
		}

		.day-number {
			font-size: 0.75rem;
		}

		.waste-icon {
			width: 18px;
			height: 18px;
			border-radius: 3px;
		}

		.waste-icon svg {
			width: 11px;
			height: 11px;
		}

		.day-icons {
			gap: 1.5px;
		}

		/* Upcoming */
		.upcoming-section h2 {
			font-size: 0.72rem;
			margin-bottom: 8px;
		}

		.upcoming-list {
			gap: 3px;
		}

		.upcoming-item {
			padding: 9px 12px;
			gap: 8px;
		}

		.upcoming-type {
			font-size: 0.78rem;
		}

		.upcoming-date {
			font-size: 0.72rem;
		}

		/* Empty state */
		.empty-state {
			padding: 40px 16px;
		}

		.empty-state p {
			font-size: 0.85rem;
		}

		/* Modal */
		.modal-backdrop {
			padding: 12px;
			align-items: flex-end;
		}

		.modal {
			padding: 20px;
			border-radius: 14px 14px 0 0;
			max-width: 100%;
			animation: slideUpMobile 0.25s ease;
		}

		.modal-header h3 {
			font-size: 1.05rem;
		}

		.export-option {
			padding: 12px 14px;
			gap: 12px;
		}

		.export-icon {
			width: 40px;
			height: 40px;
			border-radius: 8px;
		}

		.export-name {
			font-size: 0.85rem;
		}
	}

	@keyframes slideUpMobile {
		from { opacity: 0; transform: translateY(100%); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
