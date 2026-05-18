# Graph Patterns Cheatsheet

> A reference for memorizing the **shape** of each pattern. When a new problem comes in, your job is to recognize which template applies, then change only the *difference part* (state, transition, what you accumulate).

**Order below follows your request:** Topo → BFS → DFS → MST → Shortest Path → Union Find. Note that some patterns build on others (Kruskal uses Union Find; Topo uses BFS/DFS).

---

## 0. Universal Setup

Almost every graph problem starts the same way. Master this once.

```java
// Build adjacency list from edge list
int n = ...;                              // number of nodes
List<List<Integer>> graph = new ArrayList<>();
for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
for (int[] e : edges) {
    graph.get(e[0]).add(e[1]);
    graph.get(e[1]).add(e[0]);           // remove this line if DIRECTED
}

// Weighted version: use int[]{neighbor, weight}
List<int[]>[] wgraph = new List[n];
for (int i = 0; i < n; i++) wgraph[i] = new ArrayList<>();
for (int[] e : edges) {
    wgraph[e[0]].add(new int[]{e[1], e[2]});
    wgraph[e[1]].add(new int[]{e[0], e[2]});
}

// Grid as implicit graph
int[][] DIRS = {{0,1},{0,-1},{1,0},{-1,0}};   // 4-directional
// for 8-directional add {{1,1},{1,-1},{-1,1},{-1,-1}}
```

---

## 1. Topological Sort

### Signals (when to reach for it)
- "Course prerequisites", "build order", "task dependencies"
- "Must do X before Y" → a directed edge X → Y
- Asked for a **valid ordering** of a DAG
- Asked to **detect a cycle in a directed graph** (if topo can't include all nodes, there's a cycle)
- Anything where you process nodes only after all their prerequisites are done

### Thinking process
You have a DAG. A node can only be "done" after all its prerequisites are done. So:
1. Find nodes with **no prerequisites** (in-degree 0) — these are starting points.
2. Process one, then "remove" it from the graph by decrementing in-degree of its dependents.
3. Any dependent whose in-degree drops to 0 becomes ready.
4. Repeat until done. If you couldn't process all nodes, there's a cycle.

**Invariant:** when a node is popped from the queue, every node it depends on has already been popped.

### Template — Kahn's Algorithm (BFS-based, my default)

```java
public int[] topoSort(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    int[] indeg = new int[n];
    for (int[] e : edges) {                  // edge e[0] -> e[1]
        graph.get(e[0]).add(e[1]);
        indeg[e[1]]++;
    }

    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < n; i++)
        if (indeg[i] == 0) q.offer(i);

    int[] order = new int[n];
    int idx = 0;
    while (!q.isEmpty()) {
        int node = q.poll();
        order[idx++] = node;
        for (int next : graph.get(node)) {
            if (--indeg[next] == 0) q.offer(next);
        }
    }
    return idx == n ? order : new int[0];    // empty array => cycle detected
}
```

### What to swap per problem
- The starting nodes (sometimes only specific ones)
- What you accumulate alongside the order (depth, count, etc.)
- Cycle-detection-only problems: just check `idx == n`

---

## 2. BFS

### Signals
- **Shortest path / minimum steps in an unweighted graph or grid**
- "Minimum number of moves/transformations" (word ladder, knight moves, rotting oranges)
- Level-order traversal of a tree
- "All nodes at distance K"
- Multi-source BFS: "spread from multiple starting points simultaneously" (rotting oranges, 01 matrix)

> **Rule of thumb:** unweighted shortest path → BFS. Weighted → Dijkstra. Same skeleton, different container.

### Thinking process
BFS explores in concentric rings: all nodes at distance 1, then distance 2, etc. The **first time you reach a node is the shortest path to it**, because closer nodes were processed first. Use a FIFO queue and a `visited` set so you don't process the same node twice.

For level tracking, snapshot `queue.size()` at the start of each level so you process exactly one ring before incrementing the step counter.

### Template — Graph BFS (shortest path, unweighted)

```java
public int bfs(int start, int target, List<List<Integer>> graph) {
    Queue<Integer> q = new ArrayDeque<>();
    boolean[] visited = new boolean[graph.size()];
    q.offer(start);
    visited[start] = true;
    int steps = 0;

    while (!q.isEmpty()) {
        int size = q.size();                 // snapshot this level
        for (int i = 0; i < size; i++) {
            int node = q.poll();
            if (node == target) return steps;
            for (int next : graph.get(node)) {
                if (!visited[next]) {
                    visited[next] = true;
                    q.offer(next);
                }
            }
        }
        steps++;
    }
    return -1;
}
```

### Template — Grid BFS

```java
public int gridBFS(int[][] grid, int[] start, int[] target) {
    int m = grid.length, n = grid[0].length;
    boolean[][] visited = new boolean[m][n];
    Queue<int[]> q = new ArrayDeque<>();
    q.offer(start);
    visited[start[0]][start[1]] = true;
    int steps = 0;

    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            int[] cur = q.poll();
            if (cur[0] == target[0] && cur[1] == target[1]) return steps;
            for (int[] d : DIRS) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                if (visited[nr][nc] || grid[nr][nc] == /* wall */ 1) continue;
                visited[nr][nc] = true;
                q.offer(new int[]{nr, nc});
            }
        }
        steps++;
    }
    return -1;
}
```

### Multi-source BFS
**Push all sources into the queue before the loop starts.** Everything else is identical. Use this for problems like "distance from nearest 0" or "rotting oranges."

### What to swap per problem
- Termination condition (target node? grid full? specific value?)
- Neighbor generation (graph edges vs grid directions vs word transformations)
- Whether you need level tracking (yes for shortest path; no for just connectivity)

---

## 3. DFS

### Signals
- **Connected components** ("count islands", "number of provinces")
- "Find all paths from A to B"
- Cycle detection (especially in undirected graphs)
- Tree problems where parent needs info from children (post-order DP)
- Backtracking explorations
- Anything that feels naturally recursive on the graph structure

### Thinking process
DFS goes as deep as possible before backtracking. The recursion stack **is** your traversal state. Two flavors:

1. **Exploration DFS** — just visit everything reachable, mark visited. Counts components, fills regions.
2. **Returning DFS (tree-DP style)** — each call returns information up to its parent. *This is the one you must master.* Ask yourself: **"What does the parent need to know from each child?"** That return type is your function signature.

**Invariant for cycle detection in directed graphs:** maintain three states — UNVISITED, VISITING (in current DFS path), VISITED. Hitting VISITING means a back-edge → cycle.

### Template — Exploration DFS (count components, mark regions)

```java
public int countComponents(int n, List<List<Integer>> graph) {
    boolean[] visited = new boolean[n];
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i, graph, visited);
            count++;
        }
    }
    return count;
}

private void dfs(int node, List<List<Integer>> graph, boolean[] visited) {
    if (visited[node]) return;
    visited[node] = true;
    for (int next : graph.get(node)) {
        dfs(next, graph, visited);
    }
}
```

### Template — Returning DFS (post-order, info flows up)

```java
// Generic shape: "What does the parent need from each child?"
private int dfs(int node, int parent, List<List<Integer>> graph) {
    int result = /* base value, e.g. 0 or 1 */;
    for (int child : graph.get(node)) {
        if (child == parent) continue;       // avoid going back (undirected tree)
        int childResult = dfs(child, node, graph);
        result = /* combine result with childResult */;
    }
    return result;
}
```

### Template — Cycle detection in directed graph (3-color)

```java
// 0 = unvisited, 1 = visiting (on stack), 2 = fully done
private boolean hasCycle(int node, int[] state, List<List<Integer>> graph) {
    if (state[node] == 1) return true;       // back-edge, cycle
    if (state[node] == 2) return false;      // already cleared
    state[node] = 1;
    for (int next : graph.get(node)) {
        if (hasCycle(next, state, graph)) return true;
    }
    state[node] = 2;
    return false;
}
```

### What to swap per problem
- The return type (int, boolean, custom pair)
- The combine step (sum, max, AND, OR, build a list)
- The base case value
- Whether you need a `parent` parameter (yes for undirected, usually no for directed if you use visited)

---

## 4. Minimum Spanning Tree (MST)

### Signals
- "Connect all nodes with minimum total cost"
- "Minimum cost to make all cities connected"
- "Optimize a network so every node is reachable"
- Weighted **undirected** graph + "spanning" / "all nodes" + "minimum cost"

### Thinking process
You want a tree (no cycles) that touches every node and minimizes total edge weight. Two strategies:

- **Kruskal:** sort edges by weight, greedily add the cheapest one that doesn't form a cycle. Cycle check uses Union Find. *Edge-centric.*
- **Prim:** start at any node, grow the tree by repeatedly picking the cheapest edge that connects a tree node to a non-tree node. Uses a min-heap. *Node-centric.*

**Default to Kruskal** — it's simpler and reuses Union Find. Prim is sometimes nicer for dense graphs.

### Template — Kruskal (needs Union Find from Section 6)

```java
public int kruskal(int n, int[][] edges) {     // edges: [u, v, weight]
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    UnionFind uf = new UnionFind(n);
    int total = 0, used = 0;
    for (int[] e : edges) {
        if (uf.union(e[0], e[1])) {
            total += e[2];
            used++;
            if (used == n - 1) break;            // tree complete
        }
    }
    return used == n - 1 ? total : -1;           // -1 => graph disconnected
}
```

### Template — Prim

```java
public int prim(int n, List<int[]>[] graph) {    // graph[u] = list of {v, weight}
    boolean[] inTree = new boolean[n];
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{0, 0});                   // {node, edge weight to enter it}
    int total = 0, count = 0;

    while (!pq.isEmpty() && count < n) {
        int[] cur = pq.poll();
        int u = cur[0], w = cur[1];
        if (inTree[u]) continue;
        inTree[u] = true;
        total += w;
        count++;
        for (int[] edge : graph[u]) {
            if (!inTree[edge[0]]) pq.offer(edge);
        }
    }
    return count == n ? total : -1;
}
```

### What to swap per problem
- How edges are given (you may need to *build* them, e.g. "cost = manhattan distance between every pair of points")
- Sometimes you must include some edges by force — `union` those first before running Kruskal

---

## 5. Shortest Path (weighted)

### Signals
- Weighted graph + "shortest / cheapest / minimum cost path"
- "Cheapest flights", "network delay time", "path with minimum effort"
- All edges non-negative → **Dijkstra**
- Negative edges possible / "at most K stops" / detect negative cycle → **Bellman-Ford**
- All pairs shortest paths, small n (≤ ~400) → **Floyd-Warshall**

> Quick decision: unweighted → BFS · non-negative weights → Dijkstra · negative or step-limited → Bellman-Ford · all-pairs small → Floyd-Warshall.

### Thinking process (Dijkstra)
A greedy generalization of BFS. Instead of a FIFO queue, use a **min-heap** keyed by current best distance. The first time you pop a node, you have its true shortest distance (because every other path would have to go through something heavier already in the heap). Negative weights break this argument — that's why Dijkstra requires non-negative weights.

**Stale entries:** the heap can hold old, worse entries for the same node. Skip them with `if (d > dist[u]) continue;`.

### Template — Dijkstra

```java
public int[] dijkstra(int n, int src, List<int[]>[] graph) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{src, 0});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int u = cur[0], d = cur[1];
        if (d > dist[u]) continue;               // stale
        for (int[] edge : graph[u]) {
            int v = edge[0], w = edge[1];
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    return dist;
}
```

### Template — Bellman-Ford (handles negative weights, or "at most K edges")

```java
public int[] bellmanFord(int n, int src, int[][] edges) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    for (int i = 0; i < n - 1; i++) {            // relax n-1 times
        boolean updated = false;
        for (int[] e : edges) {                  // edges: [u, v, weight]
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                updated = true;
            }
        }
        if (!updated) break;                     // early termination
    }
    // Optional: one more pass to detect negative cycle
    return dist;
}
```

> For "at most K stops" problems, loop `K+1` times and **relax from a snapshot** of last iteration's dist so you don't compound updates in a single round.

### Template — Floyd-Warshall (all-pairs, small n)

```java
public int[][] floydWarshall(int n, int[][] edges) {
    int INF = Integer.MAX_VALUE / 2;             // avoid overflow on +
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) dist[e[0]][e[1]] = Math.min(dist[e[0]][e[1]], e[2]);

    for (int k = 0; k < n; k++)                  // intermediate node
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    return dist;
}
```

### What to swap per problem
- Distance type (might be `long`, or `double` for probabilities)
- Comparator (max-heap for "maximum minimum capacity" variants — Dijkstra works on any monotonic relaxation)
- Termination (often pop early once target is reached)

---

## 6. Union Find (Disjoint Set Union)

### Signals
- "Are X and Y in the same group?"
- "Number of connected components after each operation" (dynamic connectivity)
- "Redundant connection / extra edge" problems
- "Accounts merge", "friend circles", "number of islands II"
- You're merging things together over time — order matters, but only union/find ops
- Building MST with Kruskal

### Thinking process
Each element points to a "parent". The root of the tree is the group's representative. Two elements are in the same group iff they share a root. Two optimizations together give near-O(1) per operation:

1. **Path compression** (in `find`): flatten the tree as you walk up so future lookups are direct.
2. **Union by rank/size** (in `union`): attach the smaller tree under the larger one so depth stays low.

**Invariant:** `parent[x] == x` ⟺ x is a root. After `union(x, y)`, both share the same root.

### Template — Union Find (memorize this exactly)

```java
class UnionFind {
    int[] parent, rank;
    int count;                                   // number of components

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    public int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);   // path compression
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;              // already connected
        if (rank[rx] < rank[ry])      parent[rx] = ry;
        else if (rank[rx] > rank[ry]) parent[ry] = rx;
        else { parent[ry] = rx; rank[rx]++; }
        count--;
        return true;
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}
```

### What to swap per problem
- Track extra info per root (size of component, sum, etc.) — add a `size[]` array
- Map non-integer items (strings, coordinates) to integer IDs via a `HashMap<String, Integer>`
- For "redundant edge" type problems: the **first** union that returns `false` is the answer

---

## Quick Pattern Recognition Cheatsheet

| You see... | Reach for... |
|---|---|
| Unweighted shortest path / min steps | **BFS** |
| Weighted shortest path, non-neg weights | **Dijkstra** |
| Weighted, possibly negative, or "at most K edges" | **Bellman-Ford** |
| All-pairs shortest path, small n | **Floyd-Warshall** |
| Count components / explore regions | **DFS or BFS** |
| Tree problem, info flows up | **DFS (returning)** |
| Prerequisites / build order / DAG ordering | **Topo (Kahn's)** |
| Cycle in directed graph | **DFS 3-color** or **Topo (count != n)** |
| Cycle in undirected graph | **Union Find** (cycle iff `union` returns false) |
| Connect all nodes, min cost | **MST (Kruskal)** |
| Dynamic "are X and Y connected" | **Union Find** |

---

## How to use this doc

1. Before coding, **name the pattern out loud** ("this is multi-source BFS").
2. Recall the template skeleton from memory.
3. Identify the **difference part** — what state, transition, or combine step changes for this specific problem.
4. Code the template, then code the diff. Dry-run on a small example.
5. State complexity in template-default terms: BFS/DFS is O(V+E), Dijkstra is O((V+E) log V), Kruskal is O(E log E), Union Find ops are ~O(α(n)) ≈ O(1).
