/**
 * @param {Arborist} arb
 * @return {Arborist}
 */
function unwrapArrayFunction(arb) {
	const candidates = arb.ast.filter(n =>
		n.type === 'FunctionDeclaration' &&
		n.body?.body?.length === 3 &&
		n.body.body[0].type === 'VariableDeclaration' &&
		n.body.body[1].type === 'ExpressionStatement' &&
		n.body.body[2].type === 'ReturnStatement');
	for (const c of candidates) {
		if (c.body.body[0].declarations[0]?.init?.type !== 'ArrayExpression') continue;
		if (c.body.body[2].argument?.callee?.declNode?.parentNode?.nodeId !== c.nodeId) continue;
		const replacementNode = {
			type: 'BlockStatement',
			body: [{
				type: 'ReturnStatement',
				argument: c.body.body[0].declarations[0].init,
			}],
		};
		arb.markNode(c.body, replacementNode);
	}
	return arb;
}

module.exports = unwrapArrayFunction;