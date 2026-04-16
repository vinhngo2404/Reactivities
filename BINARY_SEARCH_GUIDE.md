# 🔍 Comprehensive Binary Search Guide: From Beginner to Expert

> **Goal**: Master binary search with Java templates and 40+ LeetCode practice problems
>
> **For**: Developers learning when and how to apply binary search patterns

---

## 📋 Table of Contents

1. [Fundamentals](#1-fundamentals)
2. [Core Concepts](#2-core-concepts)
3. [Pattern 1: Exact Search](#3-pattern-1-exact-search)
4. [Pattern 2: Left Bound Search](#4-pattern-2-left-bound-search)
5. [Pattern 3: Right Bound Search](#5-pattern-3-right-bound-search)
6. [Pattern 4: Search on Answer](#6-pattern-4-search-on-answer)
7. [Pattern 5: Rotated Array Search](#7-pattern-5-rotated-array-search)
8. [Pattern 6: 2D Matrix Search](#8-pattern-6-2d-matrix-search)
9. [Pattern 7: Peak Finding](#9-pattern-7-peak-finding)
10. [Pattern 8: Kth Element](#10-pattern-8-kth-element)
11. [When Binary Search FAILS](#11-when-binary-search-fails)
12. [Tips & Common Mistakes](#12-tips--common-mistakes)
13. [Practice Problems](#13-practice-problems-by-category)
14. [Learning Roadmap](#14-learning-roadmap)

---

## 1. Fundamentals

### 1.1 What is Binary Search?

**Binary Search** is a technique that:

1. **Eliminates half the search space** at each step
2. **Requires a monotonic condition** — the array or answer space must be sorted or have a clear boundary
3. **Runs in O(log n)** — dramatically faster than linear scan
4. **Works on any search space** — not just arrays, but answer ranges too

### Example: Classic Search

```
Array: [1, 3, 5, 7, 9, 11, 13], Target: 7

Step 1: mid = 6 (index 3), nums[3] = 7 → Found! ✅

vs Linear Search:
- Check 1 → no
- Check 3 → no
- Check 5 → no
- Check 7 → found! (4 steps vs 1 step)
```

### Example: Search on Answer (Binary Search SHINES here)

```
Problem: What is the minimum speed to eat all bananas in H hours?
Answer space: [1, max(piles)]

Binary search on speed:
- Try mid speed → can we finish in H hours?
- Yes → try slower (search left)
- No → try faster (search right)
```

### 1.2 When to Use Binary Search?

✅ **Use binary search when:**

- Array is **sorted** or can be treated as sorted
- Problem asks for a **minimum/maximum** value satisfying a condition
- You can define a **monotonic predicate**: `false...false...true...true`
- The search space can be **halved** based on a condition
- Problem mentions: "sorted array", "find minimum/maximum", "feasible", "at least/most k"

❌ **Don't use binary search when:**

- Array is **unsorted** with no monotonic property
- You need to find **all** occurrences (use sliding window)
- Problem requires examining **every element** (use linear scan)
- Search space has **no clear midpoint** (use DFS/BFS)

### 1.3 Time Complexity

| Approach         | Time       | Space | When                          |
| ---------------- | ---------- | ----- | ----------------------------- |
| Binary Search    | O(log n)   | O(1)  | Sorted array, monotonic space |
| Linear Scan      | O(n)       | O(1)  | Unsorted, small input         |
| Two Pointer      | O(n)       | O(1)  | Sorted, pair/window problems  |
| HashMap          | O(n)       | O(n)  | Frequency, lookup problems    |

### 1.4 The Two Packages

Everything in binary search falls into one of **two complete packages**. Mixing them causes bugs.

| Decision         | Package 1: Exact Search | Package 2: Boundary Search |
| ---------------- | ----------------------- | -------------------------- |
| `right` init     | `n - 1`                 | `n - 1` or `n`*            |
| `while` condition| `left <= right`         | `left < right`             |
| `right` update   | `mid - 1`               | `mid`                      |
| `left` update    | `mid + 1`               | `mid + 1`                  |
| return           | inside loop             | after loop (`left`)        |

*`right = n` when index `n` is a valid answer (e.g. insert position)

---

## 2. Core Concepts

### 2.1 The Core Invariant

Every binary search maintains one invariant:

```
The answer always lies within [left, right]
```

Every update to `left` and `right` must preserve this invariant.

Ask yourself before every update:
> *"Can I safely exclude `mid` from consideration?"*
- Yes → `right = mid - 1` or `left = mid + 1`
- No → `right = mid` or `left = mid`

### 2.2 Boundary Search Decision Tree

```
Is mid a valid candidate for the answer?
├─ No (mid is eliminated) → right = mid - 1 or left = mid + 1
└─ Yes (mid could be answer) → right = mid or left = mid

Finding leftmost/first occurrence?
└─ When target found: right = mid (keep searching left)

Finding rightmost/last occurrence?
└─ When target found: left = mid (keep searching right)
   └─ Must use ceiling division: mid = left + (right - left + 1) / 2
```

### 2.3 The Monotonic Predicate

Binary search works when you can define a function `f(x)` such that:

```
f(x) = false, false, false, ..., true, true, true
                                  ↑
                             find this boundary
```

Examples:
- `f(mid) = nums[mid] >= target` → find leftmost position
- `f(speed) = canFinish(speed, H)` → find minimum valid speed
- `f(mid) = nums[mid] > nums[mid+1]` → find peak

### 2.4 Floor Division vs Ceiling Division

```java
// Floor division (rounds down) — default, use for left bound
int mid = left + (right - left) / 2;

// Ceiling division (rounds up) — use for right bound
int mid = left + (right - left + 1) / 2;
```

**Why it matters:** When `left = 2, right = 3`:
- Floor: `mid = 2` → if `left = mid`, left doesn't move → **infinite loop**
- Ceiling: `mid = 3` → `left = mid = 3` → loop terminates ✅

**Rule:** Whenever you have `left = mid` in your code, use ceiling division.

---

## 3. Pattern 1: Exact Search

<details>
<summary><b>📚 Beginner's Guide: Exact Search Pattern (Click to expand)</b></summary>

### 🎯 What is Exact Search?

You are looking for a **specific value** in a sorted array and want to return its index immediately when found.

### 🔍 When to Recognize This Pattern?

- "Find target in sorted array"
- "Search in rotated sorted array"
- "Does element X exist?"
- Return index or -1

### 🧠 How to Think About It

When `nums[mid] == target`, you found your answer — return immediately.
When `nums[mid] < target`, target is in the right half.
When `nums[mid] > target`, target is in the left half.
`mid` is always eliminated (`mid - 1`, `mid + 1`) since we already checked it.

### 📝 Java Template

```java
int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;         // found!
        else if (nums[mid] < target) left = mid + 1; // go right
        else right = mid - 1;                        // go left
    }

    return -1; // not found
}
```

### 💡 Key Insight

`right = nums.length - 1` because the last index is a valid candidate.
`left <= right` because when `left > right` the space is empty — nothing left to check.

### 🔢 LeetCode Problems

- LC 704 - Binary Search (Easy)
- LC 35 - Search Insert Position (Easy)
- LC 74 - Search a 2D Matrix (Medium)

</details>

---

## 4. Pattern 2: Left Bound Search

<details>
<summary><b>📚 Beginner's Guide: Left Bound Search Pattern (Click to expand)</b></summary>

### 🎯 What is Left Bound Search?

Find the **first (leftmost) index** where a condition is true. Even after finding the target, keep searching left.

### 🔍 When to Recognize This Pattern?

- "Find first occurrence of target"
- "Find leftmost position"
- "Find minimum index satisfying condition"
- "Search Insert Position" (where would target go?)

### 🧠 How to Think About It

When `nums[mid] == target`, don't return! The answer could be even further left.
So shrink from the right: `right = mid`.
The loop converges when `left == right` — that's your answer.

### 📝 Java Template

```java
int leftBound(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left < right) {
        int mid = left + (right - left) / 2; // floor division

        if (nums[mid] < target) left = mid + 1;
        else right = mid; // mid could be the answer, don't exclude it
    }

    // left == right, check if target exists
    return nums[left] == target ? left : -1;
}
```

### 💡 Key Insights

- `right = mid` (not `mid - 1`) because `mid` could be the leftmost target
- Use floor division — `right = mid` always shrinks the space
- After loop: `left == right`, verify the value before returning

### 🔢 LeetCode Problems

- LC 34 - Find First and Last Position (Medium)
- LC 35 - Search Insert Position (Easy)
- LC 278 - First Bad Version (Easy)
- LC 374 - Guess Number Higher or Lower (Easy)

</details>

---

## 5. Pattern 3: Right Bound Search

<details>
<summary><b>📚 Beginner's Guide: Right Bound Search Pattern (Click to expand)</b></summary>

### 🎯 What is Right Bound Search?

Find the **last (rightmost) index** where a condition is true. Even after finding the target, keep searching right.

### 🔍 When to Recognize This Pattern?

- "Find last occurrence of target"
- "Find rightmost position"
- "Find maximum index satisfying condition"

### 🧠 How to Think About It

When `nums[mid] == target`, don't return! The answer could be further right.
So shrink from the left: `left = mid`.
**Warning**: This causes infinite loops with floor division! Use ceiling division.

### 📝 Java Template

```java
int rightBound(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left < right) {
        int mid = left + (right - left + 1) / 2; // CEILING division — critical!

        if (nums[mid] > target) right = mid - 1;
        else left = mid; // mid could be the answer, keep searching right
    }

    // left == right, check if target exists
    return nums[left] == target ? left : -1;
}
```

### 💡 Key Insights

- `left = mid` needs **ceiling division** — otherwise infinite loop when `left + 1 == right`
- `right = mid - 1` is safe because we're eliminating mid entirely
- After loop: `left == right`, verify the value

### ⚠️ The Infinite Loop Trap

```java
// left = 2, right = 3
// Floor mid = 2 → left = mid = 2 → STUCK FOREVER ❌
// Ceiling mid = 3 → left = mid = 3 → terminates ✅
```

### 🔢 LeetCode Problems

- LC 34 - Find First and Last Position (Medium)
- LC 1064 - Fixed Point (Easy)

</details>

---

## 6. Pattern 4: Search on Answer

<details>
<summary><b>📚 Beginner's Guide: Search on Answer Pattern (Click to expand)</b></summary>

### 🎯 What is Search on Answer?

Instead of searching in an **array**, you binary search on the **answer space** — the range of possible values for your answer.

This is the most powerful binary search pattern.

### 🔍 When to Recognize This Pattern?

**Dead giveaways:**
- "Find **minimum** X such that condition holds"
- "Find **maximum** X such that condition holds"
- "Is it **feasible** to do X?"
- Problem involves: capacity, speed, days, threshold, distance

**The key insight**: If you can answer "is X feasible?" in O(n), you can binary search on X in O(n log n).

### 🧠 How to Think About It

**Step 1**: Define the answer space `[lo, hi]`
- `lo` = minimum possible answer
- `hi` = maximum possible answer

**Step 2**: Define a monotonic predicate `canDo(mid)`
- `false, false, ..., true, true` → find leftmost `true`

**Step 3**: Binary search on the answer space using left bound template

### 📝 Java Template

```java
int searchOnAnswer(int[] nums) {
    int left = MIN_ANSWER, right = MAX_ANSWER;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (canDo(mid, nums)) {
            right = mid; // mid works, try smaller (find minimum)
        } else {
            left = mid + 1; // mid doesn't work, need larger
        }
    }

    return left; // minimum valid answer
}

boolean canDo(int mid, int[] nums) {
    // Check if `mid` is a feasible answer
    // Return true if condition is satisfied
}
```

### 🎨 Key Insight: Why This Works

```
Answer space: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
canDo(x):     [F, F, F, F, T, T, T, T, T, T ]
                            ↑
                     find this boundary
```

Binary search finds the exact boundary in O(log(answer_range)) iterations.

### 💡 Common Answer Space Choices

| Problem Type              | `left`        | `right`           |
| ------------------------- | ------------- | ----------------- |
| Minimum speed/capacity    | `1`           | `max(array)`      |
| Split array into k parts  | `max(array)`  | `sum(array)`      |
| Kth smallest              | `min`         | `max`             |
| Days to ship packages     | `max(weights)`| `sum(weights)`    |

### 🔢 LeetCode Problems

- LC 875 - Koko Eating Bananas (Medium)
- LC 1011 - Capacity to Ship Packages (Medium)
- LC 410 - Split Array Largest Sum (Hard)
- LC 1231 - Divide Chocolate (Hard)
- LC 2064 - Minimized Maximum of Products Distributed (Medium)

</details>

---

## 7. Pattern 5: Rotated Array Search

<details>
<summary><b>📚 Beginner's Guide: Rotated Array Search Pattern (Click to expand)</b></summary>

### 🎯 What is Rotated Array Search?

A sorted array has been rotated at some pivot: `[4,5,6,7,0,1,2]`.
There is **exactly one drop point**, which means one half is always fully sorted.

### 🔍 When to Recognize This Pattern?

- "Originally sorted array was rotated"
- "Find target in rotated sorted array"
- "Find minimum in rotated sorted array"

### 🧠 How to Think About It

**Key invariant**: In a rotated array, exactly one half (left or right of `mid`) is **always sorted**.

Determine which half is sorted by comparing `nums[mid]` with `nums[left]`:
- `nums[mid] >= nums[left]` → left half is sorted
- `nums[mid] < nums[left]` → right half is sorted

Then check if target falls **within the sorted half**. If yes, search there. Otherwise, search the other half.

### 📝 Java Template

```java
int searchRotated(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) return mid;

        if (nums[mid] >= nums[left]) {
            // Left half is sorted
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1; // target is in sorted left half
            } else {
                left = mid + 1;  // target is in right half
            }
        } else {
            // Right half is sorted
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1;  // target is in sorted right half
            } else {
                right = mid - 1; // target is in left half
            }
        }
    }

    return -1;
}
```

### ⚠️ Common Mistake

Only checking `target < nums[mid]` is not enough — you must check **both bounds** of the sorted half:

```java
// ❌ WRONG — misses cases like target=0 in [4,5,6,7,0,1,2]
if (target < nums[mid]) right = mid - 1;

// ✅ RIGHT — check full range of sorted half
if (target >= nums[left] && target < nums[mid]) right = mid - 1;
```

### 🔢 LeetCode Problems

- LC 33 - Search in Rotated Sorted Array (Medium)
- LC 81 - Search in Rotated Sorted Array II (Medium)
- LC 153 - Find Minimum in Rotated Sorted Array (Medium)
- LC 154 - Find Minimum in Rotated Sorted Array II (Hard)

</details>

---

## 8. Pattern 6: 2D Matrix Search

<details>
<summary><b>📚 Beginner's Guide: 2D Matrix Search Pattern (Click to expand)</b></summary>

### 🎯 What is 2D Matrix Search?

Apply binary search on a 2D matrix by treating it as a flattened 1D array, or by using the sorted property of rows/columns.

### 🔍 When to Recognize This Pattern?

- "Search in a sorted matrix"
- Matrix rows are sorted left-to-right
- Matrix columns are sorted top-to-bottom
- "Find kth smallest in matrix"

### 🧠 How to Think About It

**Type 1 (Fully sorted)**: Each row ends with values smaller than the next row's start.
→ Flatten to 1D: `row = mid / cols`, `col = mid % cols`

**Type 2 (Row + Column sorted)**: Start at top-right corner, eliminate row or column each step.

### 📝 Java Template — Type 1

```java
boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length, cols = matrix[0].length;
    int left = 0, right = rows * cols - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / cols][mid % cols]; // convert 1D index to 2D

        if (val == target) return true;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }

    return false;
}
```

### 📝 Java Template — Type 2

```java
boolean searchMatrixII(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1; // start top-right

    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] > target) col--; // eliminate column
        else row++;                                 // eliminate row
    }

    return false;
}
```

### 🔢 LeetCode Problems

- LC 74 - Search a 2D Matrix (Medium)
- LC 240 - Search a 2D Matrix II (Medium)
- LC 378 - Kth Smallest Element in a Sorted Matrix (Medium)

</details>

---

## 9. Pattern 7: Peak Finding

<details>
<summary><b>📚 Beginner's Guide: Peak Finding Pattern (Click to expand)</b></summary>

### 🎯 What is Peak Finding?

Find an element that is greater than its neighbors. Because the boundaries are treated as `-infinity`, a peak always exists.

### 🔍 When to Recognize This Pattern?

- "Find a peak element"
- "Find local maximum"
- `nums[-1] = nums[n] = -infinity` (boundary condition)

### 🧠 Key Invariant

When `nums[mid] < nums[mid+1]`:
→ The right half **must** contain a peak (values increase toward mid+1, so either mid+1 is a peak, or a peak exists further right)

When `nums[mid] > nums[mid+1]`:
→ The left half **must** contain a peak (mid itself could be the peak)

### 📝 Java Template

```java
int findPeakElement(int[] nums) {
    int left = 0, right = nums.length - 1; // right = n-1 (not n!)

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] < nums[mid + 1]) {
            left = mid + 1; // peak is to the right
        } else {
            right = mid;    // mid could be the peak, don't exclude it
        }
    }

    return left; // left == right, this is the peak
}
```

### ⚠️ Why `right = n - 1` and NOT `right = n`?

We access `nums[mid + 1]`, so `mid` can be at most `n - 2`.
With `right = n - 1` and `left < right`: max `mid = n - 2` → `mid + 1 = n - 1` ✅
With `right = n`: max `mid = n - 1` → `mid + 1 = n` → **ArrayIndexOutOfBoundsException** ❌

### 🔢 LeetCode Problems

- LC 162 - Find Peak Element (Medium)
- LC 852 - Peak Index in a Mountain Array (Medium)
- LC 1901 - Find a Peak Element II (Medium)

</details>

---

## 10. Pattern 8: Kth Element

<details>
<summary><b>📚 Beginner's Guide: Kth Element Pattern (Click to expand)</b></summary>

### 🎯 What is Kth Element Search?

Use binary search on the **answer value** to find the Kth smallest/largest element across sorted arrays or matrices.

### 🔍 When to Recognize This Pattern?

- "Find Kth smallest/largest"
- Multiple sorted arrays or a sorted matrix
- "Median of two sorted arrays"

### 🧠 How to Think About It

Binary search on the **value**, not the index.
For a candidate value `mid`, count how many elements are `<= mid`.
If `count >= k`, the answer is `<= mid` (search left).
Otherwise, search right.

### 📝 Java Template

```java
int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    int left = matrix[0][0], right = matrix[n-1][n-1];

    while (left < right) {
        int mid = left + (right - left) / 2;
        int count = countLessOrEqual(matrix, mid, n);

        if (count >= k) right = mid;  // answer is <= mid
        else left = mid + 1;          // need larger values
    }

    return left;
}

int countLessOrEqual(int[][] matrix, int mid, int n) {
    int count = 0, row = n - 1, col = 0;
    while (row >= 0 && col < n) {
        if (matrix[row][col] <= mid) {
            count += row + 1;
            col++;
        } else {
            row--;
        }
    }
    return count;
}
```

### 🔢 LeetCode Problems

- LC 378 - Kth Smallest Element in Sorted Matrix (Medium)
- LC 4 - Median of Two Sorted Arrays (Hard)
- LC 668 - Kth Smallest Number in Multiplication Table (Hard)
- LC 786 - Kth Smallest Prime Fraction (Medium)

</details>

---

## 11. When Binary Search FAILS

### Example 1: Unsorted Array

```java
// FAILS: [3, 1, 4, 1, 5] — no monotonic property
// Cannot eliminate half without sorted order
// Solution: Sort first (if allowed), or use HashMap
```

### Example 2: Non-Monotonic Condition

```java
// FAILS: Find element equal to its index in unsorted array
// canDo(mid) is not monotonic → cannot binary search
// Solution: Linear scan
```

### Example 3: Multiple Valid Boundaries

```java
// FAILS: [1, 2, 1, 2, 1] — find target=1
// Multiple occurrences, no single boundary
// If you need ALL occurrences: use linear scan or two passes with left/right bound
```

### Decision Guide

```
If binary search is failing:
1. Is the array/space sorted or monotonic? No → Not a binary search problem
2. Does a counterexample break monotonicity? Yes → Use linear scan or other approach
3. Are you mixing Package 1 and Package 2? Yes → Pick one package, stay consistent
4. Infinite loop? Check: is left = mid without ceiling division?
```

---

## 12. Tips & Common Mistakes

### 12.1 The Three Invariant Questions

Before writing any binary search, ask:
```
1. What is my search space? [left, right] or [left, right)?
2. Can mid be the answer? → determines right = mid or mid - 1
3. Is index n a valid answer? → determines right = n or n - 1
```

### 12.2 Common Mistakes

```java
// ❌ WRONG: Integer overflow
int mid = (left + right) / 2;

// ✅ RIGHT: Overflow-safe
int mid = left + (right - left) / 2;

// ❌ WRONG: Mixing packages (right = n with left <= right)
int right = nums.length; // out of bounds access when right is used as index!
while (left <= right) { ... }

// ✅ RIGHT: Stay consistent within one package
int right = nums.length - 1;
while (left <= right) { ... }

// ❌ WRONG: right = mid without verifying termination
while (left < right) {
    int mid = left + (right - left) / 2;
    if (condition) left = mid; // INFINITE LOOP without ceiling division!
}

// ✅ RIGHT: Use ceiling division when left = mid
int mid = left + (right - left + 1) / 2;
```

### 12.3 Quick Reference Card

```
Exact search (find a value):
  right = n-1, while <=, mid±1, return inside

Left bound (find first true):
  right = n-1 (or n if n is valid), while <, right=mid, floor division

Right bound (find last true):
  right = n-1, while <, left=mid, CEILING division

Search on answer (find min/max feasible):
  left=min_answer, right=max_answer, while <, canDo() predicate
```

### 12.4 Choosing the Right Template

```
Am I looking for...
├─ A specific value? → Exact Search (Package 1)
├─ First/leftmost occurrence? → Left Bound (Package 2, floor)
├─ Last/rightmost occurrence? → Right Bound (Package 2, ceiling)
└─ Min/max feasible answer? → Search on Answer (Package 2, floor)
```

---

## 13. Practice Problems by Category

### 13.1 Exact Search (3 problems)

**Easy:**
- [ ] **LC 704** - Binary Search
- [ ] **LC 35** - Search Insert Position

**Medium:**
- [ ] **LC 74** - Search a 2D Matrix

### 13.2 Left / Right Bound (4 problems)

**Easy:**
- [ ] **LC 278** - First Bad Version

**Medium:**
- [ ] **LC 34** - Find First and Last Position of Element
- [ ] **LC 1064** - Fixed Point
- [ ] **LC 374** - Guess Number Higher or Lower

### 13.3 Search on Answer (8 problems)

**Medium:**
- [ ] **LC 875** - Koko Eating Bananas
- [ ] **LC 1011** - Capacity to Ship Packages Within D Days
- [ ] **LC 1283** - Find the Smallest Divisor Given a Threshold
- [ ] **LC 2064** - Minimized Maximum of Products Distributed
- [ ] **LC 1552** - Magnetic Force Between Two Balls

**Hard:**
- [ ] **LC 410** - Split Array Largest Sum
- [ ] **LC 1231** - Divide Chocolate
- [ ] **LC 774** - Minimize Max Distance to Gas Station

### 13.4 Rotated Array (4 problems)

**Medium:**
- [ ] **LC 33** - Search in Rotated Sorted Array
- [ ] **LC 81** - Search in Rotated Sorted Array II
- [ ] **LC 153** - Find Minimum in Rotated Sorted Array

**Hard:**
- [ ] **LC 154** - Find Minimum in Rotated Sorted Array II

### 13.5 Peak Finding (3 problems)

**Medium:**
- [ ] **LC 162** - Find Peak Element
- [ ] **LC 852** - Peak Index in a Mountain Array
- [ ] **LC 1901** - Find a Peak Element II

### 13.6 2D Matrix (3 problems)

**Medium:**
- [ ] **LC 74** - Search a 2D Matrix
- [ ] **LC 240** - Search a 2D Matrix II
- [ ] **LC 378** - Kth Smallest Element in a Sorted Matrix

### 13.7 Kth Element (4 problems)

**Medium:**
- [ ] **LC 786** - Kth Smallest Prime Fraction
- [ ] **LC 378** - Kth Smallest Element in Sorted Matrix

**Hard:**
- [ ] **LC 4** - Median of Two Sorted Arrays
- [ ] **LC 668** - Kth Smallest Number in Multiplication Table

---

## 14. Learning Roadmap

### Week 1: Fundamentals

- ✅ Understand the two packages (exact vs boundary)
- ✅ Master overflow-safe mid calculation
- ✅ Learn Pattern 1 (Exact Search)
- ✅ Practice LC 704, LC 35, LC 278

### Week 2: Boundary Patterns

- ✅ Pattern 2 (Left Bound)
- ✅ Pattern 3 (Right Bound)
- ✅ Understand floor vs ceiling division
- ✅ Practice LC 34, LC 374
- ✅ Practice LC 33, LC 153 (Rotated Array)

### Week 3: Search on Answer

- ✅ Pattern 4 (Search on Answer) — most important advanced pattern
- ✅ Learn to define monotonic predicates
- ✅ Learn to identify answer space boundaries
- ✅ Practice LC 875, LC 1011, LC 410

### Week 4: Advanced Patterns

- ✅ Pattern 7 (Peak Finding)
- ✅ Pattern 6 (2D Matrix)
- ✅ Pattern 8 (Kth Element)
- ✅ Practice remaining hard problems
- ✅ Mix and identify patterns on unseen problems

---

## 📊 Problem Count Summary

| Pattern           | Easy | Medium | Hard | Total |
| ----------------- | ---- | ------ | ---- | ----- |
| Exact Search      | 2    | 1      | 0    | 3     |
| Left/Right Bound  | 1    | 3      | 0    | 4     |
| Search on Answer  | 0    | 5      | 3    | 8     |
| Rotated Array     | 0    | 3      | 1    | 4     |
| Peak Finding      | 0    | 3      | 0    | 3     |
| 2D Matrix         | 0    | 3      | 0    | 3     |
| Kth Element       | 0    | 2      | 2    | 4     |
| **TOTAL**         | **3**| **20** | **6**| **29**|

---

## 🎯 Key Takeaways

1. **Pick one package and be consistent**: Mixing Package 1 and Package 2 is the #1 source of bugs
2. **Ask "can mid be the answer?"**: This drives whether you use `mid` or `mid ± 1`
3. **Ceiling division when `left = mid`**: Otherwise infinite loop
4. **Search on Answer is the most powerful pattern**: If you can write `canDo(x)`, you can binary search
5. **Verify your search space shrinks**: Every iteration must move at least one pointer

---

## 📚 Additional Resources

- LeetCode Binary Search Tag: All binary search problems
- LeetCode Explore: Binary Search card
- LeetCode Discuss: "A template for binary search" threads

---

**Happy Binary Searching! 🔍**
