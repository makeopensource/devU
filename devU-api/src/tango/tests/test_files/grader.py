import json


def finished_grading():
    print("\nGrader finished")
    print(json.dumps({"scores": scores}))
    exit(0)


print("Grader starting")

scores = {
    "q1": 0,
    "q2": 0,
    "q3": 0,
}

negative_tests = {
    -9999987654321: 1,
    -99: 1,
    -32: 1,
    -31: 1,
    -30: 1,
    -29: 1,
    -10: 1,
    -3: 1,
    -2: 1,
    -1: 1
}

positive_odd_tests = {
    1: 3,
    3: 5,
    5: 7,
    7: 9,
    9: 11,
    11: 13,
    13: 15,
    15: 17,
    101: 103,
    1005: 1007,
}

positive_even_tests = {
    2: 3,
    4: 5,
    6: 7,
    8: 9,
    10: 11,
    100: 101,
    1000: 1001,
    12345678: 12345679,
    2222: 2223,
    3336: 3337,
}

try:
    from handin import get_next_positive_odd_number
except ImportError:
    print("Unable to import get_next_positive_odd_number from handin.py")
    finished_grading()

print("\nTesting negative numbers")
for input_number, expected_result in negative_tests.items():
    result = get_next_positive_odd_number(input_number)
    if result == expected_result:
        scores["q1"] += 1
        print(f"get_next_positive_odd_number({input_number}) returned {result}, and that's correct! (+1)")
    else:
        print(
            f"get_next_positive_odd_number({input_number}) incorrectly returned {result}, expected {expected_result}. (+0)")

print("\nTesting positive odd numbers")
for input_number, expected_result in positive_odd_tests.items():
    result = get_next_positive_odd_number(input_number)
    if result == expected_result:
        scores["q2"] += 1
        print(f"get_next_positive_odd_number({input_number}) returned {result}, and that's correct! (+1)")
    else:
        print(
            f"get_next_positive_odd_number({input_number}) incorrectly returned {result}, expected {expected_result}. (+0)")

print("\nTesting positive even numbers")
for input_number, expected_result in positive_even_tests.items():
    result = get_next_positive_odd_number(input_number)
    if result == expected_result:
        scores["q3"] += 1
        print(f"get_next_positive_odd_number({input_number}) returned {result}, and that's correct! (+1)")
    else:
        print(
            f"get_next_positive_odd_number({input_number}) incorrectly returned {result}, expected {expected_result}. (+0)")

if all([scores["q1"] == 10, scores["q2"] == 10, scores["q3"] == 10]):
    print("\nGreat job!")
else:
    print("\nTry again.")

finished_grading()
