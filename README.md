# Jota Design System

Jota is an open source WebComponents library to feed Meiuca products

## Installation
Use the package manager [yarn](https://classic.yarnpkg.com/en/docs/) or [npm](https://docs.npmjs.com/) to install the dependencies.

```
yarn install
```

or 

```
npm install
```

## Contributing
Jota is open source so have some steps to go up a new component at our library


### Gitflow
Here we use GitFlow [CheatSheet](https://danielkummer.github.io/git-flow-cheatsheet/index.pt_BR.html) to organize our branch flow.

```
git flow init
```

when you do a new component, first you need create a new branch.
To create you starter a new feature branch with the component's Name.

```
git flow feature start components/my-component
```

after create the branch, when finished you go up a new PR to  `feature/components` and tag the responsible to see, aprove and do a merge.

### Style
#### CSS Structure

Use [SUITCSS](https://suitcss.github.io/) to structure all component in our library. Use the namespace for every class start. The first letter of the Component must always be capitalize.

```
.jota-Component {}
.jota-Component-type {}
.jota-Component-type--modifier {}
```

#### Folder Structure

If you are going to create a new base-component, you need the following path to create your base-component folder 

```
├── src
│   ├── base-components
│       ├── My-base-component
│           ├── index.js
│           ├── style.js
```

or if you going to create a new component use this following path

```
├── src
│   ├── components
│       ├── My-component
│           ├── index.js
│           ├── style.js
```

