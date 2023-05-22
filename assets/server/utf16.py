import sys

def utf16_to_utf8(path):
    try:
        with open(path, "rb") as source:
            with open("utf8-{0}".format(path), "wb") as dest:
                dest.write(source.read().decode("utf-16").encode("utf-8"))
    except FileNotFoundError:
        print("doesn't exist")

def main(argv):
    try:
        utf16_to_utf8(argv[1])
    except IndexError:
        print("indexerror")

if __name__ == "__main__":
    main(sys.argv)