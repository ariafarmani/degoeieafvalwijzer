<script lang="ts">
	import { WASTE_PAGES } from '$lib/content';
	let { children } = $props();
</script>

<div class="page">
	<nav class="topbar">
		<a class="brand" href="/">← De Goude Ofvalwiezer</a>
		<a class="cta" href="/">Bekijk afvalkalender</a>
	</nav>

	<article class="prose">
		{@render children()}
	</article>

	<footer class="site-footer">
		<h2>Afval ophalen in Groningen per soort</h2>
		<ul>
			<li><a href="/afvalkalender-groningen">Afvalkalender Groningen</a></li>
			{#each WASTE_PAGES as p}
				<li><a href="/afval/{p.slug}">{p.label}</a></li>
			{/each}
		</ul>
		<p class="footer-note">
			De Goude Ofvalwiezer gebruikt de officiële ophaalgegevens van gemeente Groningen.
		</p>
	</footer>
</div>

<style>
	.page {
		max-width: 760px;
		margin: 0 auto;
		padding: 0 20px 64px;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 24px 0;
		flex-wrap: wrap;
	}

	.brand {
		font-family: var(--font-display);
		font-weight: 700;
		color: var(--text);
		text-decoration: none;
	}

	.cta {
		padding: 8px 16px;
		background: var(--accent);
		color: #fff;
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: 0.85rem;
		text-decoration: none;
	}

	.cta:hover {
		background: var(--accent-hover);
	}

	.prose :global(h1) {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 2rem;
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin-bottom: 16px;
	}

	.prose :global(h2) {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.25rem;
		margin: 32px 0 12px;
	}

	.prose :global(p) {
		line-height: 1.7;
		margin-bottom: 14px;
		color: var(--text);
	}

	.prose :global(.lead) {
		font-size: 1.1rem;
		color: var(--text-muted);
	}

	.prose :global(ul) {
		margin: 0 0 14px 1.2em;
	}

	.prose :global(li) {
		line-height: 1.7;
		margin-bottom: 4px;
	}

	.prose :global(.cols) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
	}

	@media (max-width: 560px) {
		.prose :global(.cols) {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}

	.site-footer {
		margin-top: 56px;
		padding-top: 28px;
		border-top: 1px solid var(--border);
	}

	.site-footer h2 {
		font-family: var(--font-display);
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		margin-bottom: 12px;
	}

	.site-footer ul {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		padding: 0;
		margin: 0 0 16px;
	}

	.site-footer a {
		color: var(--accent);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.site-footer a:hover {
		text-decoration: underline;
	}

	.footer-note {
		font-size: 0.8rem;
		color: var(--text-muted);
	}
</style>
