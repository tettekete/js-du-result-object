# @tettekete/du-result

## 概要

「成功」もしくは「失敗」を示す「結果」オブジェクト（`DUResultT` 型）を扱うためのモジュールです。

プリフィックスの `du-`,`DU` は Discriminated Union の略です。

「結果」オブジェクト `DUResultT` の `.ok`（あるいは `.ng`） プロパティーのブール値によって `.data` プロパティに格納されているデータの型が「判別可能な共用型（Discriminated Union）」によって決定されます。

具体的には「使用例」のサンプルコードを見てください。


## 背景

拙作 `@tettekete/result` モジュールはインスタンスベースであったため、「結果」オブジェクトを受け取る側のコードでも `.data` プロパティーの型推論のために `@tettekete/result` をインポートし型ガード関数を用いる必要がありました。

本モジュールでは純粋な「判別可能な共用型（Discriminated Union）」を用いることでその手間を減らしました。


## 使用例

```ts
// - - - - - - - - - -
// 結果オブジェクト提供者側のコード
import DUResult, { DUResultT } from '@tettekete/du-result';

// 成功または失敗のオブジェクトをランダムに返す
function resultMaker(): DUResultT<
	{ name: string; age: number },  // <-- 成功時のデータ型
	{ message: string }             // <-- 失敗時のデータ型
> {
	const type = Math.random() < 0.5 ? 'success' : 'failure';
	switch (type) {
		case 'success':
			return DUResult.success({ name: "Bob", age: 123 });

		case 'failure':
			return DUResult.failure({ message: "No one is there." });
	}
}

// - - - - - - - - - -
// 結果オブジェクト利用者側のコード
const r = resultMaker();

if( r.ok )
{
	const who = r.data;
	console.log('OK:', `name: ${who.name} / age: ${who.age}`);
		// name や age プロパティーに TypeScript 警告無しにアクセス出来る
}
else
{
	const err = r.data;
	console.error('Error:', err.message);
		// message プロパティーに TypeScript 警告無しにアクセス出来る
}
```

_このコードは `examples/00.basic.ts` からの引用です。  
`ts-node examples/00.basic.ts` を実行することで動作を確認できます。_

## DUResult クラス

`DUResult` はデフォルトエクスポートなので、任意の名前でインポートできます。ここでは説明のため `DUResult` を使用しています。

このクラスはインスタンスを生成せず、2つの静的メソッドだけを提供します。  
実質的には名前空間の役割としてのクラスです。

各メソッドは、インスタンスの代わりに `DUResultT` 型のオブジェクトを返します。

### `success([message [, data]])`

`DUResultT<T, never>` 型のオブジェクトを返します。

### `failure([message [, data]])`

`DUResultT<never, E>` 型のオブジェクトを返します。

## `DUResultT<T, E>` 型

Discriminated Union 型です。  
`ok` または `ng` の値によって、`data` プロパティの型が `T` または `E` に絞り込まれます。

実際の型定義は以下の通りです：

```ts
export type DUResultT<T = unknown, E = unknown> =
	| { readonly ok: true; readonly ng: false; readonly data: T; readonly message: string }
	| { readonly ok: false; readonly ng: true; readonly data: E; readonly message: string };
```

### `ok`: `boolean` / `readonly`

成功オブジェクトのときに `true` に、失敗オブジェクトのとき `false` になります。

### `ng`: `boolean` / `readonly`

失敗オブジェクトのときに `true` に、成功オブジェクトのとき `false` なります。

### `message`: `string` / `readonly`

任意の文字列。  

`DUResult.success()` または `DUResult.failure()` によって作成された場合、デフォルトはそれぞれ `"success"` / `"failure"` になります。

### `data`: `<T | E>` / `readonly`

任意のデータを格納するプロパティです。  

`DUResult.success()` によって作られた場合は `T` 型、`DUResult.failure()` によって作られた場合は `E` 型になります。
