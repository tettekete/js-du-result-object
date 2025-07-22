# @tettekete/du-result

## Overview

This module provides a way to handle "result" objects (`DUResultT`) that represent either success or failure.

The prefix "DU" stands for discriminated union.

The type of the `.data` property in a "result" object (`DUResultT`) is determined by the boolean value of the `.ok` (or `.ng`) property, using a discriminated union.

For a concrete understanding, it's best to look at the example code in the SYNOPSIS section.


## Background

My module `@tettekete/result` was instance-based, which meant that consumer-side code receiving a result object also had to import `@tettekete/result` and use a type guard function to enable proper type inference for the `.data` property.

This module reduces that burden by using a pure discriminated union type.


## SYNOPSIS

```ts
// - - - - - - - - - -
// Provider-side code
import DUResult, { DUResultT } from '@tettekete/du-result';

// Returns a random success or failure object.
function resultMaker(): DUResultT<
	{ name: string; age: number },  // <-- data type for success
	{ message: string }             // <-- data type for failure
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
// Consumer-side code
const r = resultMaker();

if( r.ok )
{
	const who = r.data;
	console.log('OK:', `name: ${who.name} / age: ${who.age}`);
		// You can access the `name` and `age` properties 
		// without any TypeScript warnings.
}
else
{
	const err = r.data;
	console.error('Error:', err.message);
		// You can access the `message` property without
		// any TypeScript warnings.
}
```

_This code is quoted from `examples/00.basic.ts`.  
You can run it with `ts-node examples/00.basic.ts` to see it in action._

## DUResult class

`DUResult` is the default export, so you can import it under any name. We'll use `DUResult` here for clarity.

The `DUResult` class does not generate instances and only provides two static methods.  
It essentially acts as a namespace.

Each method returns a `DUResultT` object instead of a class instance.

### `success([message [, data]])`

Returns an object of type `DUResultT<T, never>`.

### `failure([message [, data]])`

Returns an object of type `DUResultT<never, E>`.

## `DUResultT<T, E>` type

A discriminated union type.  
Depending on whether the object has `ok` or `ng`, the type of the `data` property will be narrowed to `T` or `E`.

Here is the actual type definition:

```ts
export type DUResultT<T = unknown, E = unknown> =
	| { readonly ok: true; readonly ng: false; readonly data: T; readonly message: string }
	| { readonly ok: false; readonly ng: true; readonly data: E; readonly message: string };
```

### `ok`: `boolean` / `readonly`

`true` for success objects. `false` for failure objects.

### `ng`: `boolean` / `readonly`

`true` for failure objects. `false` for success objects.

### `message`: `string` / `readonly`

An arbitrary string.  
If the object is created using `DUResult.success()` or `DUResult.failure()`, the default is `"success"` or `"failure"` respectively.

### `data`: `<T | E>` / `readonly`

Any payload data.  
If created via `DUResult.success()`, it will be of type `T`; if created via `DUResult.failure()`, it will be of type `E`.
