import {describe, expect, test} from '@jest/globals';
import Result,{DUResultT} from '../src';

function resultMaker( type: 'success' | 'failure' )
	:DUResultT<{name:string,age:number},{message: string}>
{
	switch( type )
	{
		case 'success':
			return Result.success({ name: "Bob" ,age: 123 });
		
		case 'failure':
			return Result.failure({ message: "No one is there."})
	}
}

describe('Basic discriminated union usage.',()=>
{
	test('There are name and age props when success.',() =>
	{
		const r = resultMaker('success');
		
		expect( r.ok ).toBeTruthy();
		if( r.ok )
		{
			expect( r.data.name ).toBe( "Bob" );
			expect( r.data.age ).toBe( 123 );
		}
	});

	test('There are message prop when failure.',() =>
	{
		const r = resultMaker('failure');
		
		expect( r.ng ).toBeTruthy();
		if( r.ng )
		{
			expect( r.data.message ).toBe( "No one is there." );
		}
	});
});

