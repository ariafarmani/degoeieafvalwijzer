export interface WasteEntry {
	type: string;
	date: string;
}

export interface WasteTypeConfig {
	label: string;
	color: string;
	bg: string;
	icon: string;
}

export const WASTE_TYPES: Record<string, WasteTypeConfig> = {
	gft: { label: 'GFT', color: '#16a34a', bg: '#dcfce7', icon: 'M12 3c-1.5 2-5 4-5 8a5 5 0 0010 0c0-4-3.5-6-5-8zM9 13c1 1.5 3 2 5 .5' },
	papier: { label: 'Papier', color: '#1d4ed8', bg: '#dbeafe', icon: 'M6 3h8l4 4v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm8 0v4h4M8 9h8M8 13h8M8 17h5' },
	restafval: { label: 'Restafval', color: '#525252', bg: '#e5e5e5', icon: 'M8 4h8l2 16H6L8 4zM6 4h12M10 4V2h4v2M10 9h4M10 13h4' },
	grofafval: { label: 'Grofafval', color: '#b45309', bg: '#fef3c7', icon: 'M4 21h16M5 21V11l7-7 7 7v10M9 21v-6h6v6' },
	pmd: { label: 'PMD', color: '#ea580c', bg: '#fff7ed', icon: 'M9 2h6a1 1 0 011 1v1H8V3a1 1 0 011-1zM8 4h8s1 0 1 1v14a1 1 0 01-1 1H8a1 1 0 01-1-1V5s0-1 1-1zM10 4V2M14 4V2M12 8v4M10 10h4' },
	textiel: { label: 'Textiel', color: '#7c3aed', bg: '#ede9fe', icon: 'M6 3h12l-1 7h-4l-1 11h-1L10 10H6L6 3zM6 3c0 0 2 1 6 1s6-1 6-1' },
	kca: { label: 'KCA', color: '#d946ef', bg: '#fae8ff', icon: 'M9 3h6l3 6-3 3h2l1 6H6l1-6h2L6 9l3-6zM12 3v6' },
	kerstboom: { label: 'Kerstboom', color: '#166534', bg: '#bbf7d0', icon: 'M12 2l-5 7h3l-4 6h3l-4 6h14l-4-6h3l-4-6h3L12 2zM11 21h2v-2h-2v2' }
};

export const DEFAULT_FILTERS = ['restafval', 'gft', 'papier'];

export const DUTCH_MONTHS = [
	'januari', 'februari', 'maart', 'april', 'mei', 'juni',
	'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

export const DUTCH_DAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
