export type Bindings = {
	USERNAME: string;
	PASSWORD: string;
	HONO_TODO: KVNamespace;
};

declare global {
	function getMiniflareBindings(): Bindings;
}
