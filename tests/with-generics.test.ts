import {describe, expect, test} from '@jest/globals';
import Result from '../src';

/* Result クラスのジェネリクスサポートのテストスクリプトです */

type TokenSet = {
	idToken: string;
	refreshToken: string;
};

function isTokenSet( obj: unknown ): obj is TokenSet
{
	if( ! obj || typeof obj !== 'object' )
	{
		return false;
	}

	const tokenSet = obj as TokenSet;
	return (
		Object.prototype.hasOwnProperty.call( tokenSet, 'idToken' ) &&
		Object.prototype.hasOwnProperty.call( tokenSet, 'refreshToken' ) &&
		typeof tokenSet.idToken === 'string' &&
		typeof tokenSet.refreshToken === 'string'
	);
}

describe.each([
	{f: ()=>{return Result.success<TokenSet>("OK",{idToken: "abc", refreshToken: "def"})}		,b: true	,m:"OK"			,o: {idToken: "abc", refreshToken: "def"}},
	{f: ()=>{return Result.success<TokenSet>(undefined,{idToken: "abc", refreshToken: "def"})}	,b: true	,m:"success"	,o: {idToken: "abc", refreshToken: "def"}},
	{f: ()=>{return Result.success<TokenSet>(null,{idToken: "abc", refreshToken: "def"})}		,b: true	,m:"success"	,o: {idToken: "abc", refreshToken: "def"}},
	{f: ()=>{return Result.success<TokenSet>({idToken:"abc", refreshToken:"def"})}				,b: true	,m:"success"	,o: {idToken: "abc", refreshToken: "def"}},
	{f: ()=>{return Result.failure<TokenSet>("NG",{idToken: "abc", refreshToken: "def"})}		,b: false	,m:"NG" 		,o: {idToken: "abc", refreshToken: "def"}},
	{f: ()=>{return Result.failure<TokenSet>(undefined,{idToken: "abc", refreshToken: "def"})}	,b: false	,m:"failure"	,o: {idToken: "abc", refreshToken: "def"}},
	{f: ()=>{return Result.failure<TokenSet>(null,{idToken: "abc", refreshToken: "def"})}		,b: false	,m:"failure"	,o: {idToken: "abc", refreshToken: "def"}},
	{f: ()=>{return Result.failure<TokenSet>({idToken:"abc", refreshToken:"def"})}				,b: false	,m:"failure"	,o: {idToken: "abc", refreshToken: "def"}},
])("Result<T> success()",({f, b, m, o})=>
{
	test(`returns ${b}`, ()=>
	{
		const r = f();
		
		expect( r.ok ).toBe( b );
		expect( r.ng ).toBe( !b );
		
		expect( r.message ).toBe( m );
		
		if( r.data != null )	// data is not undefined or null
		{
			expect( isTokenSet( r.data )).toBe( true );
			expect( r.data.idToken ).toBeDefined();
			expect( r.data.idToken ).toBe( o.idToken);
			expect( r.data.refreshToken ).toBeDefined();
			expect( r.data.refreshToken ).toBe( o.refreshToken);
		}
	});
});