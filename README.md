# SquadFormer

A responsively designed website that let's you form random groups of people. It remembers past groups so newly generated groups will not contain repeats.

[https://squadformer.herokuapp.com/](https://squadformer.herokuapp.com/)

![screenshot of home page](https://github.com/davidlinke/squadformer/blob/master/public/images/screenshots/home.png 'Screenshot of home page')

![screenshot of view squads page](https://github.com/davidlinke/squadformer/blob/master/public/images/screenshots/viewSquad.png 'Screenshot of view squads page')

![screenshot of view groups page](https://github.com/davidlinke/squadformer/blob/master/public/images/screenshots/viewGroups.png 'Screenshot of view groups page')

## Features

- Create a squad of people
- Stores last created squad in local storage so if you forget the URL, you can get back to it on the homepage
- Edit squad name
- Add, remove, and mark people as absent in your squad
- Generates groups from the people in your squad of a group size of your choosing
- Suggests group sizes for even distribution
- Can rearrange people in groups by dragging and dropping
- Displays visual feedback if a group combination has existed in the past
- Can save groups
- Can see a read-only page of group composition to send to people in your squad
- Can see a history of past groups generated
- Alerts you if no more newly random squads can be generated
- Can reset past combination history
- Custom 404 / 500 error page

## Technologies, Frameworks, and Libraries

- HTML / CSS
- Javascript
- Express
- EJS
- MongoDB
- jQuery
- [Milligram](https://milligram.io)
- [Dragula](https://bevacqua.github.io/dragula/)
- [Popover.js](https://popper.js.org)
- [Moment.js](https://momentjs.com)

## Future Improvements

- Better form validation / handling of extra spaces and newlines
- Make URL for read only groups page unique so the edit URL cannot be found from it
- Allow for editing of peoples names
- Maybe adding accounts/logins, though I like the simplicity of it working without it.
- Add concept of multiple squad management rather than separate links for each squad (i.e. for a teacher with multiple classrooms, if they don't want to individually bookmark each classroom)
- Investigate ways to make group randomization algorithm more efficient / allow for fuzzier logic to reduce members of a group from being grouped together as much
- Remove old data from the database automatically after a period of inactivity
