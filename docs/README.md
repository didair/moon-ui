<h3 align="center">
	<img src="https://github.com/didair/moonly/blob/main/docs/moonly_color.png?raw=true" width="250" alt="Logo"/><br/>
</h3>

# moonly

```javascript
Box({
  class: "whitespace-pre",
  children: [
    AnimatedText({
      children: "moonly",
      class: "text-6xl font-bold py-4 block",
    }),
    "Extremely simple and small javascript library. Styles are a first class citizen.\n",
    "Use functions, objects and arrays to write UIs, no magic required.",
  ],
});
```

### Reactive?

Oh yes!

```javascript
const App = () => {
  const counter = signal(0);

  return Box({
    class: "flex gap-6 flex-col items-center",
    children: [
      Text({
        class: "text-2xl block",
        children: ["Button has been pressed ", counter, " times"],
      }),

      Box({
        children: Button({
          text: "Add 1",
          onClick: () => {
            counter.value += 1;
          },
        }),
      }),
    ],
  });
};

const List = () => {
  const list = signal(["Item #1", "Item #2"]);

  return Box({
    class: "flex gap-6 flex-col items-center",
    children: [
      Box({
        class: "block",
        children: ({ list }) => {
          return list.value.map((item) => item + ", ");
        },
        props: {
          list,
        },
      }),

      Box({
        children: button({
          text: "Add item",
          onClick: () => {
            list.value = [
              ...list.value,
              "Item " + (list.value.length + 1),
            ];
          },
        }),
      }),
    ],
  });
};
```

<p align="center">
	<br /><br /><br />
	<img src="https://github.com/didair/moonly/blob/main/docs/moonly_icon.png?raw=true" width="55" />
</p>
