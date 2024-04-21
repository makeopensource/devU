# This is an example of a correct solution.
# It can be helpful to test your grader with the correct solution in the same directory where the student's handin
# will end up. You don't need to include the correct solution in the grader archive.

def get_next_positive_odd_number(number: int) -> int:
    # Given `number`, return the next positive odd number.
    # If `number` is negative, return 1.
    # If `number` is positive and odd, return `number` + 2.
    # If `number` is positive and even, return `number` + 1.
    return max(1, number + (number % 2) + 1)
