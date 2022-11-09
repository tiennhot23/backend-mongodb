# MongoDB

## How does MongoDB store data

Mongo store data in memory with BSON (Binary Json) format, optimized for speed, space and flexibility

![JSON and BSON.](/public/images/jsonandbson.PNG)

## CRUD

## Advanced CRUD operations

- __Comparison__

$eq = equal to
$ne = not equal to
$gt = greater than
$lt = less than
$gte = greater than or equal to
$lte = less than or equal to

- __Logic__

  $and, $or, $nor (fail to match both given clauses), $not

- __Expressive Query__

  $expr allows to use aggregation expressions, variables and conditional statements within query

 `$` sympol have 2 usage:

- Denotes the use of an operator (like $expr, $regexMatch, ...)
- Address the field value (such as value of field 'email')

```js
await EmailModel.find({ $expr: { $regexMatch: {
      input: '$email',
      regex: /@student[.\w]+$/,
    } } })
await UserModel.find({ $expr: { $eq: [ '$firstName', '$lastName' ] } })
```

![Aggregation closer look.](/public/images/aggregationsyntax.PNG)

- __Array operators__

- __Array operators and projection__
- __Array operators and subdocuments__
