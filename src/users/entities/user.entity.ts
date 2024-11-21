/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "src/utility/common/users-role.enum";

// database table structure representation
@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({unique:true})
    email: string;

    @Column({select:false})
    password: string;
    
    @Column({type:'enum', enum:Roles,array:true,default:[Roles.USER]})
    roles:Roles[]

    @CreateDateColumn()
    createdAt:Date
    
    @UpdateDateColumn()
    updatedAt:Date
}
