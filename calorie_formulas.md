# Calorie Summation and Target Comparison Formulas

This document outlines the formulas used in the "Calorie Tracker" spreadsheet for summing daily calories and comparing them against the user's target.

## "Today's Log" Sheet Formulas

Let's assume the following for the "Today's Log" sheet:
*   Column C is the 'Calories' column where users input calorie values for each food item.
*   Rows for food items start from row 2 downwards (row 1 being for headers).

### 1. Total Daily Calories

*   **Purpose:** To calculate the sum of all calories consumed throughout the day.
*   **Formula:** `=SUM(C2:C)`
    *   This formula sums all values in column C, starting from cell C2 down to the last row with data in that column.
*   **Placement:**
    *   **Option A (Dedicated Cell):** This total could be displayed in a prominent cell, for example, `F1` or `G1` at the top of the sheet.
    *   **Option B (End of Column):** Alternatively, it could be placed in the first empty cell at the bottom of the 'Calories' column itself (e.g., if the last entry is C100, the sum could be in C101, though this is less common for a running total).
    *   **Recommended:** A dedicated cell at the top, like `F1`, is generally cleaner. Let's assume `F1` for this document.
        *   Cell `E1` (Label): "Total Calories Today:"
        *   Cell `F1` (Formula): `=SUM(C2:C)`

### 2. Displaying Daily Calorie Target

*   **Purpose:** To show the user's set daily calorie target directly on the "Today's Log" sheet for easy reference.
*   **Assumption:** The "Daily Calorie Target" is stored in the "User Profile" sheet. Let's assume this value is in cell `B1` of a sheet named `User Profile`.
    *   If the cell in "User Profile" containing the target is named (e.g., `DailyTarget`), the formula would be `=DailyTarget`.
*   **Placement (in "Today's Log" sheet):**
    *   Cell `E2` (Label): "Daily Calorie Target:"
    *   Cell `F2` (Formula): `='User Profile'!B1`
        *   *Note: The exact sheet name and cell reference must match the actual spreadsheet setup. If the "User Profile" sheet has a space in its name, the single quotes are necessary.*

### 3. Remaining Calories

*   **Purpose:** To calculate and display the difference between the "Daily Calorie Target" and the "Total Calories Today".
*   **Formula:** `=F2-F1`
    *   This assumes "Daily Calorie Target" is displayed in `F2` and "Total Calories Today" is in `F1` of the "Today's Log" sheet.
*   **Placement (in "Today's Log" sheet):**
    *   Cell `E3` (Label): "Remaining Calories:"
    *   Cell `F3` (Formula): `=F2-F1`

## Example Layout in "Today's Log" Sheet (Cells E1:F3)

| Column E             | Column F           |
| :------------------- | :----------------- |
| Total Calories Today: | `=SUM(C2:C)`       |
| Daily Calorie Target:| `='User Profile'!B1` |
| Remaining Calories:  | `=F2-F1`           |

### Functional Description

*   As a user adds food items and their corresponding calories into column C of "Today's Log", the formula in `F1` will automatically update to reflect the new total.
*   The formula in `F2` will pull the target value set by the user in their "User Profile" sheet. If the user updates their target in the "User Profile", this change will be reflected in "Today's Log".
*   The formula in `F3` will then dynamically calculate how many calories the user has left for the day, or how many they have gone over their target (which would result in a negative number).

This setup provides a clear, at-a-glance summary of the user's progress against their daily calorie goals. The "Next Day Plan" sheet could have a similar summation for its planned calories, but comparison to the target would typically be done on the day itself.
