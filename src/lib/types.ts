export interface WasteEntry {
	type: string;
	date: string;
}

export interface WasteTypeConfig {
	label: string;
	color: string;
	bg: string;
}

export const WASTE_TYPES: Record<string, WasteTypeConfig> = {
	gft: { label: 'GFT', color: '#16a34a', bg: '#dcfce7' },
	papier: { label: 'Papier', color: '#1d4ed8', bg: '#dbeafe' },
	restafval: { label: 'Restafval', color: '#525252', bg: '#e5e5e5' },
	grofafval: { label: 'Grofafval', color: '#b45309', bg: '#fef3c7' },
	pmd: { label: 'PMD', color: '#dc2626', bg: '#fee2e2' },
	textiel: { label: 'Textiel', color: '#7c3aed', bg: '#ede9fe' },
	kca: { label: 'KCA', color: '#d946ef', bg: '#fae8ff' },
	kerstboom: { label: 'Kerstboom', color: '#166534', bg: '#bbf7d0' }
};

export const DEFAULT_FILTERS = ['restafval', 'gft', 'papier'];

export const DUTCH_MONTHS = [
	'januari', 'februari', 'maart', 'april', 'mei', 'juni',
	'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

export const DUTCH_DAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
