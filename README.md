# MongoDB

## ORM/ODM

- ORMs (Object Relational Mapping): hỗ trợ mapping giữa Object Model với Relational DB.

Các ORM sẽ sử dụng 1 SQL database Driver như ODBC, JDBC hoặc OLEDB để chuyển đổi giữa Object notation và Relational notation.

- ODMs  (Object Document Mapping): hỗ trợ mapping giữa Object Model với Document DB

Ví dụ: Mandago, Mongoose trong MongoDB

Các ODM thì sử dụng JSON hoặc JSONB api để chuyển đổi giữa Object notation và Document notation.

## RelationalDB vs DocumentDB(MongoDB)

### Store data

MongoDB structure data in documents (similar to json object), RelationalDB structure data in table

### Flexibility schema

Document can be use to model data of any shape or structure

MongoDB have no restrictions on schema design and dont have any relations between documents. In relationalDB, u need to define tables and columns, every row have same structure (same column)

### Relationships

MongoDB doesn’t support JOIN like RelationalDB. JOIN allows the user to link data from two or more tables in a single query

### Performance and Speed

MongoDB can handle large unstructured data

## Mongoose vs MongoDB Driver

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB

## Mongoose

### Schema

Schema maps to MongoDB collection and defines the structure of the document, each key defines a property which will be cast to `SchemaType`

With nested object keys, mongoose only create schema path for leaves (like phone.homePhone, phone.companyPhone) and the brach `phone` dont have path so `phone` cannot have it own validation. If u need it, u must create the __`Subdocuments`__

```js
const userSchema = new Schema({
  phone: {
    homePhone: String,
    companyPhone:  String
  }
});
```

### Subdocuments

 __Subdocuments__ are documents embedded in other documents. In Mongoose, this means you can nest schemas in other schemas. Mongoose has two distinct notions of subdocuments: arrays of subdocuments and single nested subdocuments

```js
const parentSchema = new Schema({
  // Array of subdocuments
  children: [childSchema],
  // Single nested subdocuments
  child: childSchema,
  childRef: {
    type: mongoose.ObjectId,
    ref: 'Child'
  }
});
const doc = await Parent.findOne().populate('child');
// populated documents NOT a subdocument. `doc.child` is a separate top-level document.
```

### ObjectIds

___id__ property is add by default by Mongoose. When you create a new document, Mongoose creates a new id of type __ObjectId__ to your document

> NOTE: mongoose.ObjectId !== mongoose.Types.ObjectId
> mongoose.ObjectId is mongodb ObjectId, mongoose.Types.ObjectId is mongoose ObjectId

The 12-byte ObjectId consists of:

1. A 4-byte timestamp, representing the ObjectId's creation, measured in seconds since the Unix epoch.

2. A 5-byte random value generated once per process. This random value is unique to the machine and process.

3. A 3-byte incrementing counter, initialized to a random value.

`ObjectId` can accept one of the following inputs:

- Hexadecimal => 24 character hexadecimal string value
- Integer => timestamp in second

### SchemaType

> A SchemaType is different from a type

- String
- Number
- Date

Mongoose unaware of `Built-in Date` methods. If you must modify `Date` types using built-in methods, tell mongoose about the change with doc.markModified('pathToYourDate') before saving.

```js
const Assignment = mongoose.model('Assignment', { dueDate: Date });
Assignment.findOne(function (err, doc) {
  doc.dueDate.setMonth(3);
  doc.save(callback); // THIS DOES NOT SAVE YOUR CHANGE

  doc.markModified('dueDate');
  doc.save(callback); // works
})
```

- Buffer
- Mixed

An "anything goes" SchemaType. Mongoose will not do any casting on mixed paths. To tell Mongoose that the value of a Mixed type has changed, you need to call `doc.markModified(path)`

- ObjectIds
- Boolean
- Arrays (default [], u can change default value by using `default` option)
- Map

In Mongoose Maps, keys must be strings in order to store the document in MongoDB.

```js
const userSchema = new Schema({
  socialMediaHandles: {
    type: Map,
    of: String
  },
  authen: {
    type: Map,
    of: new Schema({
      handle: String,
      oauth: {
        type: ObjectId,
        ref: 'OAuth'
      }
    })
  }
});

const User = mongoose.model('User', userSchema);
new User({
  socialMediaHandles: {
    github: 'vkarpov15',
    twitter: '@code_barbarian'
  })
//`github` or `twitter` are not declared as paths
```

With `Map` type, you must use .get() to get the value of a key and .set() to set the value of a key.

Map types are stored as BSON objects in MongoDB. Keys in a BSON object are ordered, so this means the insertion order property of maps is maintained.

To populate all elements in a map, use a special `$*` syntax

```js
const user = await User.findOne().populate('authen.$*.oauth');
```

- Schema

### Indexes

#### Compound index

### Schema validation

#### Mongoose schema validation

Mongoose ‘schema’ is a document data structure that is enforced via the application layer

Validate data types in models (String, Boolean, ...) and specific validators such as requiring certain fields, ensuring a minimum or maximum length for a specific field.

These rules only apply at the application layer cause Mongo is schema-less

```js
const blog = new Schema({
   title: {
       type: String,
       required: true,
   },
   published: Boolean,
   content: {
       type: String,
       required: true,
       minlength: 250
   },
   ...
});
 
const Blog = mongoose.model('Blog', blog);
```

#### MongoDB native schema validation

### Populate and Lookup

Both Mongoose and the Native driver support the ability to combine documents from multiple collections in the same database (similar to JOIN in relational databases).

#### Native `$lookup` (MongoDB v3.2)

It allows to do a __left outer join__ on collections.

Assum we have 2 model as below, instead of storing all info of user, it just store that user’s `_id`

```js
const user = new Schema({
   name: String,
   email: String
});
 
const blog = new Schema({
   title: String,
   comments: [{
       user: { Schema.Types.ObjectId, ref: 'User' },
       content: String,
       votes: Number
   }]
});
 
const User = mongoose.model('User', user);
const Blog = mongoose.model('Blog', blog);
```

If we want to make a join-like operation, we could create an aggregation pipeline to do it.

```js
db.collection('blog').aggregate([
  {
    '$lookup': {
      'from': 'users', 
      'localField': 'comments.user', 
      'foreignField': '_id', 
      'as': 'users'
    }
  }, {}
], (err, blog) => {
    console.log(blog.users); //This would contain an array of users
});
```

#### Mongoose `Populate`

Like `$lookup`, it allows to create data models that can reference each other. But, it also lets you __reference documents in other collections__.

Population is the process of replacing the specific paths in document with another document from other collection

Now, if we wanted to populate our user property, instead of just returning the _id, we will make it return the entire document

```js
Blog.
   findOne({}).
   populate('comments.user').
   exec(function (err, blog) {
       console.log(blog.comments[0].user.name) // Name of user for 1st comment
   });
```

- __How it work?__

> Mongoose's `populate()` method does not use MongoDB's `$lookup` behind the scenes. It simply makes more query to the database.

With `Order.find().populate(‘users’)` operation, it will make 2 query

```js
Mongoose: orders.find({}, { projection: {} })
Mongoose: users.find({ _id: { '$in': [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ... 60000 more items ] }}, { projection: {} })
```

- __Usage__

Example:

```js
const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema)
```

_ __Saving ref__

```js
const author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});

author.save(function (err) {
  if (err) return handleError(err);

  const story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
  });
});
```

_ __Population__

```js
Story.
  findOne({ title: 'Casino Royale' }).
  populate('author').
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log('The author is %s', story.author.name);
    // => "The author is Ian Fleming"
  });
```

_ __No document__

Same as left join, when there is no document, it will be null or empty array

_ __Field selection__

```js
Story.
  findOne({ title: /casino royale/i }).
  populate('author', 'name'). // only return the Persons name
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log('The author is %s', story.author.name);
    // prints "The author is Ian Fleming"
    console.log('The authors age is %s', story.author.age);
    // prints "The authors age is null"
  });
```

_ __Populating Multiple Paths__

If you call populate() multiple times with the same path, only the last one will take effect.

```js
Story.
  find(...).
  populate({ path: 'fans', select: 'name' }). // ignored
  populate({ path: 'fans', select: 'email' }).
  populate('author').
  exec();
```

- __Dynamic References via `refPath`__

Instead of a hardcoded model name in `ref` which one ref one model, `refPath` will find right model in another property

```js
// Instead of multi ref
product: {
  type: Schema.Types.ObjectId,
  ref: 'Product'
},
blogPost: {
  type: Schema.Types.ObjectId,
  ref: 'BlogPost'
}
// u can use refPath
doc: {
  type: Schema.Types.ObjectId,
  refPath: 'docModel'
},
docModel: {
  type: String,
  enum: ['BlogPost', 'Product']
}
```

- __Populate Virtuals__

```js
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Email',
  }],
  /** NOTE
  book: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
  this is `bad schema design`, the amount of book this user write maybe very large
  => leed to performance issues
  one-to-many relationships, should be stored on the "many" side.
  But, normal populate dont support populating an user's books
  So that, u need to use `virtual populate`
   */
});

// virtual populate
userSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'author',
});

//populate user's books
(await UserModel.findOne().populate('books')).books
```

## Mongoose helper

### Virtual property

A virtual property is not persisted to the database. We can add it to our schema as a helper to get and set values

```js
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

userSchema.virtual('fullname')
  .get(() => `${this.firstName} ${this.lastName}`)
  .set(function (fullname) { // this must use function keyword to access `this` userschema
    const strs = fullname.split(' ');
    this.lastName = strs.pop();
    this.firstName = _.join(strs, ' ');
  });

module.exports = mongoose.model('User', userSchema);
```

### Instance Methods

```js
userSchema.methods.toNameUppercase = function () {
  return `${this.firstName} ${this.lastName}`.toUpperCase();
};
```

### Static Methods

```js
userSchema.statics.getUsers = function () {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if (err) return reject(err);
      return resolve(docs);
    });
  });
};
```
