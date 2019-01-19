
export default class Collection extends Map {
	find(func: Function) {
		for(const item of this.values()) {
			if(func(item)) {
				return item;
			}
		}
		return undefined;
	}

	filter(func: Function) {
		const arr = [];
		for(const item of this.values()) {
			if(func(item)) {
				arr.push(item);
			}
		}
		return arr;
	}

	map(func: Function) {
		const arr = [];
		for(const item of this.values()) {
			arr.push(func(item));
		}
		return arr;
	}

	remove(obj: any) {
		const item = this.get(obj.id);
		if(!item) {
			return null;
		}
		this.delete(obj.id);
		return item;
	}
}
