import test from 'ava';
import sinon from 'sinon';
import Handler from './../handler';

let sandbox;
let HandlerInstance;
const connection = { query: () => {} };

test.before('create handler', () => {
  const results = [
    {
      id: 1,
      email: 'user1@test.com',
      age: 24,
      cid: 1,
      compname: 'Company A',
    },
    {
      id: 2,
      email: 'user2@test.com',
      age: 28,
      cid: 2,
      compname: 'Company B',
    },
  ];
  HandlerInstance = new Handler(connection, results);
  sandbox = sinon.sandbox.create();
  sandbox.stub(HandlerInstance, 'setCompany').returns(Promise.resolve(4));
  sandbox.stub(connection, 'query').callsFake((id, callback) => callback(null, { insertId: 5 }, { }));
});

test.after('restore the sandbox', () => {
  sandbox.restore();
});

test('addUser', async (t) => {
  t.plan(1);
  const args = {
    email: 'test@test.com',
    age: 30,
    company: 'Company C',
  };
  const expectedValue = {
    id: 5,
    email: 'test@test.com',
    age: 30,
    company: {
      id: 4,
      name: 'Company C',
    },
  };
  t.deepEqual(await HandlerInstance.addUser(args), expectedValue);
});

test('getAllUsers', (t) => {
  t.plan(1);
  const expectedValue = [
    {
      id: 1,
      email: 'user1@test.com',
      age: 24,
      company: {
        id: 1,
        name: 'Company A',
      },
    },
    {
      id: 2,
      email: 'user2@test.com',
      age: 28,
      company: {
        id: 2,
        name: 'Company B',
      },
    },
  ];
  t.deepEqual(HandlerInstance.getAllUsers(), expectedValue);
});

test('getUserByEmail', (t) => {
  t.plan(1);
  const expectedValue = {
    id: 2,
    email: 'user2@test.com',
    age: 28,
    company: {
      id: 2,
      name: 'Company B',
    },
  };
  t.deepEqual(HandlerInstance.getUserByEmail('user2@test.com'), expectedValue);
});

test('getUserById', (t) => {
  t.plan(1);
  const expectedValue = {
    id: 1,
    email: 'user1@test.com',
    age: 24,
    company: {
      id: 1,
      name: 'Company A',
    },
  };
  t.deepEqual(HandlerInstance.getUserById(1), expectedValue);
});

test('updateUser', async (t) => {
  t.plan(1);
  const args = {
    id: 2,
    email: 'test@test.com',
    age: 30,
    company: 'Company C',
  };
  const expectedValue = {
    id: 2,
    email: 'test@test.com',
    age: 30,
    company: {
      id: 4,
      name: 'Company C',
    },
  };
  t.deepEqual(await HandlerInstance.updateUser(args), expectedValue);
});

test('deleteUser', async (t) => {
  t.plan(1);
  t.deepEqual(await HandlerInstance.deleteUser(1), undefined);
});
