# This is an example of an incorrect solution.

def get_next_positive_odd_number(number: int) -> int:
    # Given `number`, return the next positive odd number.
    # If `number` is negative, return 1.
    # If `number` is positive and odd, return `number` + 2.
    # If `number` is positive and even, return `number` + 1.
    return max(1, number + (number % 3) + 1)
