var Schema = {
    users: {
        id: {type: 'increments', nullable: false, primary: true},
        address: {type: 'string', maxlength: 1000, nullable: false},
        name: {type: 'string', maxlength: 150, nullable: false},
        gender: {type: 'string', maxlength: 150, nullable: false},
        key: {type: 'string', maxlength: 1000, nullable: false}
    },
    vendors: {
        id: {type: 'increments', nullable: false, primary: true},
        name: {type: 'string', maxlength: 150, nullable: false},
        industry: {type: 'string', maxlength: 150, nullable: false},
        username: {type: 'string', maxlength: 150, nullable: false, unique: true},
        password: {type: 'string', maxlength: 1000, nullable: false},
        salt: {type: 'string', maxlength: 1000, nullable: false}
    },
    posts: {
        id: {type: 'increments', nullable: false, primary: true},
        user_id: {type: 'integer', nullable: false, unsigned: true},
        category_id: {type: 'integer', nullable: false, unsigned: true},
        title: {type: 'string', maxlength: 150, nullable: false},
        slug: {type: 'string', maxlength: 150, nullable: false, unique: true},
        html: {type: 'text', maxlength: 16777215, fieldtype: 'medium', nullable: false},
        created_at: {type: 'dateTime', nullable: false},
        updated_at: {type: 'dateTime', nullable: true}
    },
    tags: {
        id: {type: 'increments', nullable: false, primary: true},
        slug: {type: 'string', maxlength: 150, nullable: false, unique: true},
        name: {type: 'string', maxlength: 150, nullable: false}
    },
    posts_tags: {
        id: {type: 'increments', nullable: false, primary: true},
        post_id: {type: 'integer', nullable: false, unsigned: true},
        tag_id: {type: 'integer', nullable: false, unsigned: true}
    }
};
module.exports = Schema;