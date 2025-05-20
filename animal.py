class Animal:

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def print_name(self):
        print("This is a debug line")
        print("Animal name:", self.name)