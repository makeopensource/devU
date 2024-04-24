# This is an example of an incorrect solution because the function name is incorrect.

def incorrect_function_name(number: int) -> int:
    # Given `number`, return the next positive odd number.
    # If `number` is negative, return 1.
    # If `number` is positive and odd, return `number` + 2.
    # If `number` is positive and even, return `number` + 1.
    return max(1, number + (number % 2) + 1)
