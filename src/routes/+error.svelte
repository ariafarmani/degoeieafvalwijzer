<script lang="ts">
	import { page } from '$app/state';
</script>

<main>
	<div class="error-container">
		<h1>{page.status}</h1>
		<p>{page.error?.message || 'Er ging iets mis'}</p>
		<a href="/">Terug naar home</a>
	</div>
</main>

<style>
	main {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 20px;
	}

	.error-container {
		text-align: center;
		padding: 120px 20px;
	}

	h1 {
		font-family: var(--font-display);
		font-size: 4rem;
		font-weight: 800;
		color: var(--accent);
		line-height: 1;
	}

	p {
		margin-top: 8px;
		font-size: 1.1rem;
		color: var(--text-muted);
	}

	a {
		display: inline-block;
		margin-top: 24px;
		padding: 10px 24px;
		background: var(--accent);
		color: white;
		border-radius: var(--radius-sm);
		font-weight: 600;
		text-decoration: none;
		transition: background 0.15s;
	}

	a:hover {
		background: var(--accent-hover);
	}
</style>
