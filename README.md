# LaTeX Editor and Calculator

A web-based application for editing and calculating LaTeX equations in real-time.

## Features

### LaTeX Editor
- Real-time equation editing with MathQuill
- Dual-side equation editing (left and right sides)
- Add new rows with Shift+Enter
- Copy current row with Command+Enter
- Delete rows with the delete icon
- Keyboard navigation between fields

### LaTeX Calculator
- Real-time equation calculation
- Support for basic arithmetic operations
- Trigonometric functions
- Logarithms and exponentials
- Matrix operations
- Vector operations

## Usage

### LaTeX Editor
1. Type equations in the left or right math field
2. Use Shift+Enter to add a new row
3. Use Command+Enter to copy the current row
4. Click the delete icon to remove a row
5. Navigate between fields using Tab and Shift+Tab

### LaTeX Calculator
1. Enter your equation in the input field
2. The result will be displayed in real-time
3. Use the keyboard or click the buttons to input mathematical symbols

## Examples

### LaTeX Editor
- Quadratic equation: `ax^2 + bx + c = 0`
- Matrix multiplication: `\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}`

### LaTeX Calculator
- Basic arithmetic: `2 + 2 = 4`
- Trigonometric functions: `\sin(\pi/2) = 1`
- Logarithms: `\log_2(8) = 3`

## Troubleshooting

- If equations don't render, check your LaTeX syntax
- For calculation errors, ensure your equation is well-formed
- If the server is not responding, check that it's running on port 5000

## Acknowledgments

- MathQuill for the equation editor

## Http Server Prerequisite

The back-end http endpoints are not included in this project. Please implement an http server that provide endpoints like

```bash
curl -X POST http://localhost:5000/expand \
     -H "Content-Type: application/json" \
     -d '{"expression": "\\left(x + 1\\right) \\left(x + 2\\right)"}'
```

which returns 

```json
{
  "result": "x^{2} + 3 x + 2"
}
```

, and 

```bash
curl -X POST http://localhost:5000/factor \
     -H "Content-Type: application/json" \
     -d '{"expression": "x^2+3*x+2"}'
```

which returns 

```json
{
  "result": "\\left(x + 1\\right) \\left(x + 2\\right)"
}
```

## Configuration

The application can be configured through `config.js`:

```javascript
const CONFIG = {
    API: {
        BASE_URL: 'http://localhost:5000',
        ENDPOINTS: {
            EXPAND: '/expand',
            FACTOR: '/factor'
        }
    },
    UI: {
        DEBOUNCE_TIME: 300,
        COPY_FEEDBACK_DURATION: 2000
    }
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 