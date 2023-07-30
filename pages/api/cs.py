
def Capitalize():
    try:
        with open('cs.txt', 'r') as f:
            content = f.read()

            def capital(sentance):
                result = ""
                _next = True

                for char in sentance:
                    if char.isalpha and _next:

                        result += char.upper()
                        _next = False
                    else:
                        result += char
                    if char == ".":
                        _next = True
                return result
            final = capital(content)

            with open('ayush.txt', 'w') as f:
                f.write(final)
            print("Success")

    

    except FileNotFoundError as e:
        print("File Not Found", e)

Capitalize()