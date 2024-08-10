# Selection

> Content Selection DOM Utility

## Usage

### Initialize Content Selection

```js
const ts = contentSelection({
  onSelect: (data) => {
    const { text, isSingleLine, isBackward } = data
    // Handle selection
  },
  onDeselect: (data) => {
    // Handle deselection
  }
})
```

### Activate In Vue3 Component

```js
onMounted(() => {
  ts.on()
})

onBeforeUnmount(() => {
  ts.off()
})
```

### Activate in React Component

```js
useEffect(() => {
  ts.on()
  return () => ts.off()
}, [])
```

### API Reference

| Method | Description |
|--------|-------------|
| `ts.on()` | Activates the content selection listener |
| `ts.off()` | Deactivates the content selection listener |

### Selection Data

The `onSelect` callback receives a data object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `text` | string | The selected text content |
| `isSingleLine` | boolean | Whether the selection is on a single line |
| `isBackward` | boolean | Whether the selection was made backwards |
| `startRect` | DOMRect | The bounding rectangle of the start of the selection |
| `endRect` | DOMRect | The bounding rectangle of the end of the selection |
| `locateRect` | DOMRect | The bounding rectangle of the current selection location, perform like `endRect` |

### Example

```js
const ts = contentSelection({
  onSelect: ({ text, isSingleLine, isBackward }) => {
    console.log('Selected text:', text)
    console.log('Is single line:', isSingleLine)
    console.log('Is backward selection:', isBackward)
  },
  onDeselect: () => {
    console.log('Selection cleared')
  }
})

// Activate the selection listener
ts.on()

// Later, when you want to stop listening
ts.off()
```

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


### Support

If you encounter any problems or have questions about using this library, please open an issue on the GitHub repository. I'll do my best to assist you.
