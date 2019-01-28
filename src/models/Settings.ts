import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('settings')
export class Setting {
	@PrimaryColumn({ type: 'bigint' })
	guild!: string;

	@Column({ default: '.' })
	prefix!: string;
}
