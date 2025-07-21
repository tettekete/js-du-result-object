import {describe, expect, test} from '@jest/globals';
import Result from '../src';


describe.each([
	{value: "hello"			,type: "string" },
	{value: 1234			,type: "number" },
	{value: true			,type: "boolean" },
	{value: {}				,type: "object" },
	{value: []				,type: "object" },
	{value: null			,type: "object" },
	{value: undefined 		,type: "undefined" },
	{value: Symbol() 		,type: "symbol" },
	{value: BigInt(123)		,type: "bigint" },
	{value: function(){}	,type: "function" },
])("Result.data is no emit type warning",({value, type})=>
{
	test(`type ${type} data`, ()=>
	{
		const data = Result.success( value ).data;
		expect( typeof data ).toBe( type );
		expect( data ).toBe( value );
	});
});