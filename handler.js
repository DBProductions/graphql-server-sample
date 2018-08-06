module.exports = class {
  /**
   * Set connection and load entries
   * @param {Object} db
   */
  constructor(db) {
    this.db = db;
    this.db.user.belongsTo(this.db.companies, { foreignKey: 'companyid', targetKey: 'id' });

    this.users = [];
    this.loadEntries().then(() => {});
  }

  /**
   * Load entries user combined with companies.
   */
  loadEntries() {
    return new Promise((resolve, reject) => {
      this.users = [];
      this.db.user.findAll({
        include: [
          {
            model: this.db.companies,
            attributes: [['id', 'cid'], 'name'],
            required: false, // force a left join, true force inner join
          },
        ],
      }).then((results) => {
        let user;
        results.forEach((val) => {
          user = {
            id: val.dataValues.id,
            email: val.dataValues.email,
            age: val.dataValues.age,
            company: {
              id: undefined,
              name: undefined,
            },
          };
          if (val.dataValues.company) {
            user.company.id = val.dataValues.company.dataValues.cid;
            user.company.name = val.dataValues.company.dataValues.name;
          }
          this.users.push(user);
        });
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * set company for user
   * @param {String} company
   */
  async setCompany(company) {
    return new Promise((resolve, reject) => {
      this.db.companies.findOrCreate({ where: { name: company } })
        .spread((result) => {
          const entry = result.get();
          resolve(entry.id);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * add a new user
   * @param {String} email
   * @param {String} age
   */
  async addUser(args) {
    return new Promise((resolve, reject) => {
      const { email, age, company } = args;
      this.setCompany(company).then((val) => {
        this.db.user.create({
          email,
          age,
          companyid: val,
          created_at: new Date(),
          updated_at: new Date(),
        }).then((user) => {
          this.loadEntries().then(() => {
            resolve(user);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * get all users
   */
  async getAllUsers() {
    return this.users;
  }

  /**
   * get an user by email
   * @param {String} email
   */
  async getUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  /**
   * get an user by id
   * @param {Int} id
   */
  async getUserById(u) {
    return this.users.find(item => item.id === Number(u.uid));
  }

  /**
   * get all companies
   */
  async getAllCompanies() {
    return new Promise((resolve, reject) => {
      const companies = [];
      this.db.companies.findAll({}).then((results) => {
        let company;
        results.forEach((val) => {
          company = {
            id: parseInt(val.dataValues.id, 10),
            name: val.dataValues.name,
          };
          companies.push(company);
        });
        resolve(companies);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * update an user
   * @param {Object} args
   */
  async updateUser(args) {
    return new Promise((resolve, reject) => {
      const {
        id,
        email,
        age,
        company,
      } = args;
      this.setCompany(company).then((val) => {
        this.db.user.findOne({ where: { id } }).then((user) => {
          if (user) {
            user.update({
              email,
              age,
              companyid: val,
            }).then(() => {
              this.loadEntries().then(() => {
                resolve(user.toJSON());
              });
            }).catch((err) => {
              reject(err);
            });
          } else {
            reject('user not found');
          }
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }

  /**
   * delete an user
   * @param {Int} id
   */
  async deleteUser(args) {
    return new Promise((resolve, reject) => {
      const { id } = args;
      this.db.user.findOne({ where: { id } }).then((user) => {
        let response = null;
        if (user) {
          user.destroy();
          response = user.toJSON();
        }
        this.loadEntries().then(() => {
          resolve(response);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }
};
