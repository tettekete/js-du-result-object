import {describe, expect, test} from '@jest/globals';
import Result from '../src';


describe('Testing for compatibility after generics support',()=>
{
	test("r.data is 'Hello'",()=>
	{
		const r = Result.success("OK","Hello");
		expect(r.data === "Hello").toBeTruthy();
	});

	test("r.data is 777",()=>
	{
		const r = Result.success(777);
		expect(r.data === 777 ).toBeTruthy();
	});
});
