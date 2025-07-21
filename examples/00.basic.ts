
import DUResult ,{DUResultT} from '../src';

function resultMaker()
	:DUResultT<{name:string,age:number},{message: string}>
{
	const type = Math.random() < 0.5 ? 'success' : 'failure';
	switch( type )
	{
		case 'success':
			return DUResult.success({ name: "Bob" ,age: 123 });
		
		case 'failure':
			return DUResult.failure({ message: "No one is there."})
	}
}

const r = resultMaker();

if( r.ok )
{
	const who = r.data;
	console.log('OK:' , `name: ${who.name} / age: ${who.age}`);
}
else
{
	const err = r.data;
	console.error( 'Error:' , err.message );
}

