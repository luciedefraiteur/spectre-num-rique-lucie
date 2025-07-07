import { parseLuciformDocument } from '../../core/luciform_parser/parser';
import { expect } from 'chai';
import { LuciformDocument, PromenadeActionNode, JsonActionNode, MessageActionNode } from '../../core/luciform_parser/types';

describe('Luciform Parser - Promenade Block', () => {
  it('should correctly parse a promenade action with a description', () => {
    const luciformContent = `
---PAS---
[Action]
promenade: Explore the ancient ruins for hidden artifacts.
`;
    const doc: LuciformDocument = parseLuciformDocument(luciformContent);
    const pas = doc.pas[0];
    const action = pas.action as PromenadeActionNode;

    expect(pas).to.not.be.null;
    expect(action).to.not.be.null;
    expect(action.type).to.equal('promenade');
    expect(action.description).to.equal('Explore the ancient ruins for hidden artifacts.');
  });

  it('should correctly parse a promenade action without a description', () => {
    const luciformContent = `
---PAS---
[Action]
promenade:
`;
    const doc: LuciformDocument = parseLuciformDocument(luciformContent);
    const pas = doc.pas[0];
    const action = pas.action as PromenadeActionNode;

    expect(pas).to.not.be.null;
    expect(action).to.not.be.null;
    expect(action.type).to.equal('promenade');
    expect(action.description).to.equal('');
  });

  it('should return null action if no action block is found', () => {
    const luciformContent = `
---PAS---
Some random text.
`;
    const doc: LuciformDocument = parseLuciformDocument(luciformContent);
    const pas = doc.pas[0];

    expect(pas).to.not.be.null;
    expect(pas.action).to.be.null;
  });

  it('should return a message type if action is not promenade or JSON', () => {
    const luciformContent = `
---PAS---
[Action]
just a message
`;
    const doc: LuciformDocument = parseLuciformDocument(luciformContent);
    const pas = doc.pas[0];
    const action = pas.action as MessageActionNode;

    expect(pas).to.not.be.null;
    expect(action).to.not.be.null;
    expect(action.type).to.equal('message');
    expect(action.message).to.equal('just a message');
  });

  it('should parse a JSON action correctly', () => {
    const luciformContent = `
---PAS---
[Action]
{
  "type": "shell_command",
  "command": "ls -la"
}
`;
    const doc: LuciformDocument = parseLuciformDocument(luciformContent);
    const pas = doc.pas[0];
    const action = pas.action as JsonActionNode;

    expect(pas).to.not.be.null;
    expect(action).to.not.be.null;
    expect(action.type).to.equal('json_action');
    expect(action.operation.type).to.equal('shell_command');
    expect(action.operation.command).to.equal('ls -la');
  });

  it('should parse multiple pas blocks', () => {
    const luciformContent = `
---PAS---
[Action]
promenade: First promenade.
---PAS---
Some text for second pas.
[Action]
{
  "type": "shell_command",
  "command": "echo Hello"
}
---PAS---
Third pas content.
`;
    const doc: LuciformDocument = parseLuciformDocument(luciformContent);

    expect(doc.pas).to.have.lengthOf(3);

    const pas1 = doc.pas[0];
    const action1 = pas1.action as PromenadeActionNode;
    expect(pas1.content).to.equal('');
    expect(action1.type).to.equal('promenade');
    expect(action1.description).to.equal('First promenade.');

    const pas2 = doc.pas[1];
    const action2 = pas2.action as JsonActionNode;
    expect(pas2.content).to.equal('Some text for second pas.');
    expect(action2.type).to.equal('json_action');
    expect(action2.operation.type).to.equal('shell_command');
    expect(action2.operation.command).to.equal('echo Hello');

    const pas3 = doc.pas[2];
    expect(pas3.content).to.equal('Third pas content.');
    expect(pas3.action).to.be.null;
  });
});