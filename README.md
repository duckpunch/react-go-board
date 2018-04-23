# React Go Board

A simple SVG board in the form of a [React][react] component to render a
[Godash][godash] [Board][board].

Resize it by putting it in a sized container.

# Getting started

```javascript
import React from 'react';
import godash from 'godash';
import {Goban} from 'react-go-board';

function handleCoordinateClick(coordinate) {
    // http://duckpunch.github.io/godash/documentation/#coordinate
    coordinate;
}

export default function RenderMe() {
    const board = new godash.Board(19);
    const annotations = [new Coordinate(2, 2)];
    return <Goban
        board={board}
        boardColor='#efefef'
        annotation={annotations}
        onCoordinateClick={handleCoordinateClick} />;
}
```

# Future stuff

* Optional coordinate labels
* Annotations (whenever I do annotations for Godash)

[react]: https://github.com/facebook/react
[godash]: https://github.com/duckpunch/godash
[board]: http://duckpunch.github.io/godash/documentation/#board_1
