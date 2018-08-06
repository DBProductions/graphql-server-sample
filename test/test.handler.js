import test from 'ava';
import sinon from 'sinon';
import Handler from '../handler';

let sandbox;
let HandlerInstance;
const connection = {
  query: () => {},
  QueryTypes: {
    SELECT: 1,
    INSERT: 1,
    UPDATE: 1,
    DELETE: 1,
  },
  user: {
    belongsTo: () => {},
    create: () => new Promise((resolve) => {
      resolve({
        id: 5,
        email: 'test@test.com',
        age: 30,
        company: {
          id: 4,
          name: 'Company C',
        },
      });
    }),
    findAll: () => new Promise((resolve) => {
      resolve([
        {
          dataValues: {},
        },
      ]);
    }),
    findOne: () => new Promise((resolveFindOne) => {
      resolveFindOne({
        id: 2,
        email: 'user2@test.com',
        age: 28,
        companyid: 4,
        destroy: () => {},
        update: () => new Promise((resolve) => {
          resolve({
            id: 2,
          });
        }),
        toJSON: () => ({
          id: 2,
          email: 'user2@test.com',
          age: 28,
          companyid: 4,
        }),
      });
    }),
  },
};

test.before('create handler', () => {
  HandlerInstance = new Handler(connection);
  sandbox = sinon.createSandbox();
  sandbox.stub(HandlerInstance, 'setCompany').returns(Promise.resolve(4));
  sandbox.stub(HandlerInstance, 'loadEntries').returns(Promise.resolve(
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
  ));
  HandlerInstance.users = [{
    id: 1,
    email: 'user1@test.com',
    age: 24,
    company: {
      id: 2,
      name: 'Company B',
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
  }];
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

test('getAllUsers', async (t) => {
  t.plan(1);
  const expectedValue = [
    {
      id: 1,
      email: 'user1@test.com',
      age: 24,
      company: {
        id: 2,
        name: 'Company B',
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
  HandlerInstance.users = expectedValue;
  t.deepEqual(await HandlerInstance.getAllUsers(), expectedValue);
});

test('getUserByEmail', async (t) => {
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
  t.deepEqual(await HandlerInstance.getUserByEmail('user2@test.com'), expectedValue);
});

test('getUserById', async (t) => {
  t.plan(1);
  const expectedValue = {
    id: 1,
    email: 'user1@test.com',
    age: 24,
    company: {
      id: 2,
      name: 'Company B',
    },
  };
  t.deepEqual(await HandlerInstance.getUserById({ uid: 1 }), expectedValue);
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
    email: 'user2@test.com',
    age: 28,
    companyid: 4,
  };
  t.deepEqual(await HandlerInstance.updateUser(args), expectedValue);
});

test('deleteUser', async (t) => {
  t.plan(1);
  t.deepEqual(await HandlerInstance.deleteUser(1), {
    id: 2,
    email: 'user2@test.com',
    age: 28,
    companyid: 4,
  });
});
