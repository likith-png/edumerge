import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  FileText, Upload, CheckCircle2, ChevronRight,
  ShieldAlert, Settings, RefreshCw, Brain, Sparkles
} from 'lucide-react';

interface QuestionEvaluation {
  qNo: string;
  maxMarks: number;
  aiSuggestedMarks: number;
  overrideMarks: string;
  feedback: string;
  criteriaAlignment: string;
}

interface StudentScript {
  id: string;
  name: string;
  rollNo: string;
  subject: string;
  status: 'Evaluated' | 'Pending AI' | 'Ready for Review';
  totalMarks: number;
  maxTotal: number;
  ocrText: string;
  questions: QuestionEvaluation[];
  conceptualGaps: string[];
}

type SubjectKey = 'ADA' | 'DBMS' | 'CN';

const initialScriptsData: Record<SubjectKey, StudentScript[]> = {
  ADA: [
    {
      id: 'ADA-001',
      name: 'Aditya Sen',
      rollNo: 'CSE-2026-081',
      subject: 'Analysis & Design of Algorithms',
      status: 'Ready for Review',
      totalMarks: 23,
      maxTotal: 30,
      ocrText: `
Q1. Answer:
Dijkstra's algorithm is a single source shortest path algorithm that works on weighted graphs without negative edge cycles.
Step 1: Set distances of all vertices from source to infinity. Source distance = 0.
Step 2: Maintain a set S of visited vertices.
Step 3: While all vertices are not in S, pick minimum distance vertex u from unvisited vertices, insert in S.
Step 4: Relax all adjacent vertices of u.
Trace for given graph: Source A.
Distances: A=0, B=4, C=2. Pick C. Neighbors of C: B. Dist(A,B) through C = 2+1 = 3. Distance B updated to 3. Shortest path tree compiled.
Complexity is O(V^2). With min-heap it is O(E log V).

Q2. Answer:
Knapsack 0/1 problem solved using dynamic programming.
Let dp[i][w] be max value. Recurrence is dp[i][w] = max(dp[i-1][w], dp[i-1][w-w[i]] + v[i]).
Formula is correct, but dynamic table was filled with small addition errors in row 3. Outstanding value is calculated as 220 instead of 240.

Q3. Answer:
Kruskal's algorithm is a greedy algorithm for minimum spanning tree.
Sort all edges in non-decreasing order of weight. Choose smallest edge. Check if it forms a cycle with MST already formed using Disjoint Set Union (DSU) operations. Find(u) != Find(v).
Complexity is O(E log E) or O(E log V) for sorting.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Excellent explanation of Dijkstra steps and path tracing. Graph verification is 100% correct.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 6,
          overrideMarks: '6',
          feedback: 'DP recurrence formula correctly formulated. Minor mathematical calculation gap in the final table row.',
          criteriaAlignment: 'Requires Review (Analytical Rigor)'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Kruskal sorting logic and DSU integration well explained. Diagram could have clarified cycle detection.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        }
      ],
      conceptualGaps: [
        'DP Matrix indexing calculation offset in row 3.',
        'Omission of visual cycle representation in MST building.'
      ]
    },
    {
      id: 'ADA-002',
      name: 'Rohan Gupta',
      rollNo: 'CSE-2026-104',
      subject: 'Analysis & Design of Algorithms',
      status: 'Evaluated',
      totalMarks: 27,
      maxTotal: 30,
      ocrText: `
Q1. Dijkstra: Dijkstra is a greedy algorithm. S = empty. Add source to S. Relax neighbor d(v) = min(d(v), d(u) + w(u,v)). Correct paths trace. Complexity O(V^2).
Q2. Knapsack: Knapsack DP table built successfully. Row 1 to 5 values verified. Solution = 240. Correct.
Q3. Kruskal: Sorted edges. Picked edges without cycle. DSU tree union by rank implemented. Complexity O(E log V).
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Correct greedy approach illustration. Optimal path correctly derived.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 10,
          overrideMarks: '10',
          feedback: 'Perfect execution of dynamic programming table. Final solution matches rubric target.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Kruskal steps documented. Minor detail missing on union-find balancing optimizations.',
          criteriaAlignment: 'Meets Criterion C2'
        }
      ],
      conceptualGaps: []
    },
    {
      id: 'ADA-003',
      name: 'Pooja Hegde',
      rollNo: 'CSE-2026-059',
      subject: 'Analysis & Design of Algorithms',
      status: 'Ready for Review',
      totalMarks: 21,
      maxTotal: 30,
      ocrText: `
Q1. Answer: Dijkstra finds shortest paths from source. It uses a queue to retrieve nodes and relax edge weights. For V nodes, we do V relaxations. Running time is O(V^2) or O(E log V).
Q2. Answer: Knapsack 0/1 using dynamic programming requires a table of size N x W. We fill cells using dp[i][w] = max of taking or leaving the item. I drew the table for the weights.
Q3. Answer: Kruskal is a greedy algorithm where we sort edges. If edge connects different sets, we add it. I missed writing the DSU find complexity.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 7,
          overrideMarks: '7',
          feedback: 'Basic concept explained correctly but missed specifying that Dijkstra requires non-negative edge weights.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'DP table is correct and recurrence formula is well defined. Solution value is correct.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 6,
          overrideMarks: '6',
          feedback: 'Kruskal sorted edge selection is explained, but DSU operations (Find & Union) are completely omitted.',
          criteriaAlignment: 'Requires Review'
        }
      ],
      conceptualGaps: [
        'Dijkstra negative edge constraints omitted.',
        'DSU operations (Union by Rank / Path Compression) missing in Kruskal.'
      ]
    },
    {
      id: 'ADA-004',
      name: 'Megha Sharma',
      rollNo: 'CSE-2026-102',
      subject: 'Analysis & Design of Algorithms',
      status: 'Evaluated',
      totalMarks: 25,
      maxTotal: 30,
      ocrText: `
Q1. Dijkstra: Dijkstra tracks shortest paths by greedily picking the vertex with the minimum distance. Relax step updates paths: d[v] = d[u] + w(u,v). Correct.
Q2. Knapsack: Knapsack DP table built successfully. Solution = 240. Correct.
Q3. Kruskal: Sorted edges. Picked edges without cycle. DSU tree union by rank implemented. Complexity O(E log V).
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Steps listed correctly. Shortest paths verified.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Correct formulation structure and dynamic table execution.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Greedy approach trace correct. Disjoint set union well explained.',
          criteriaAlignment: 'Meets Criterion C2'
        }
      ],
      conceptualGaps: [
        'Greedy vs DP algorithm distinction clear but missing complex proof logs.'
      ]
    }
  ],
  DBMS: [
    {
      id: 'DBMS-001',
      name: 'Vikram Malhotra',
      rollNo: 'CSE-2026-112',
      subject: 'Database Management Systems',
      status: 'Ready for Review',
      totalMarks: 27,
      maxTotal: 30,
      ocrText: `
Q1. Answer:
ER Diagram (Entity-Relationship) represents semantic models.
Entities are mapped to tables, attributes to columns, relationships to foreign keys.
Key elements: Entity, Weak Entity, Attributes (Key, Composite, Multi-valued), Relationships (1:1, 1:N, N:M).
For N:M relationships, a new junction table is required with composite primary keys.

Q2. Answer:
Normalization is structural design to minimize redundancy.
3NF: A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on the primary key.
BCNF (Boyce-Codd Normal Form): A relation is in BCNF if for every functional dependency X -> Y, X is a superkey.
BCNF is stronger than 3NF. Not all 3NF relations can be decomposed into BCNF without losing functional dependencies.

Q3. Answer:
SQL Joins query data across multiple tables.
INNER JOIN: Returns matching records.
LEFT OUTER JOIN: Returns all records from left table and matching from right.
Query: SELECT e.name, d.dept_name FROM employee e LEFT JOIN department d ON e.dept_id = d.id;
This is correct.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'ER concepts and schema conversion explained in excellent detail.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Good comparative study of 3NF and BCNF. Correct dependency preservation analysis.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Query syntax is 100% correct. Left join output trace is accurate.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        }
      ],
      conceptualGaps: [
        'Minor detail omitted regarding lossless-join decomposition verification.'
      ]
    },
    {
      id: 'DBMS-002',
      name: 'Sneha Patel',
      rollNo: 'CSE-2026-045',
      subject: 'Database Management Systems',
      status: 'Evaluated',
      totalMarks: 24,
      maxTotal: 30,
      ocrText: `
Q1. ER Diagram: Entity, Attributes, Relationships. Drawn diagram for Company database. Map primary keys to tables.
Q2. Normalization: 1NF removes atomic values. 2NF removes partial dependencies. 3NF removes transitive dependencies. BCNF requires left side of functional dependency to be superkey.
Q3. SQL Join: Inner vs Left Outer join. Left outer join returns all values of left table and matches of right. Query: SELECT * FROM T1 LEFT JOIN T2 ON T1.id = T2.id;
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Basic ER diagram and mapping steps are correct. Missed weak entity definitions.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Correct normalization definitions. Missing step-by-step normalization decomposition sample.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'SQL join query matches rubric. Needs to specify performance implications of outer joins.',
          criteriaAlignment: 'Meets Criterion C2'
        }
      ],
      conceptualGaps: [
        'Weak entity notation and key mapping is missing.',
        'Normalization decomposition proof is missing.'
      ]
    },
    {
      id: 'DBMS-003',
      name: 'Amit Sharma',
      rollNo: 'CSE-2026-015',
      subject: 'Database Management Systems',
      status: 'Ready for Review',
      totalMarks: 18,
      maxTotal: 30,
      ocrText: `
Q1. ER Model: It is entity relationship. We draw rectangles for entities, ovals for attributes, and diamonds for relations.
Q2. Normalization: Redundancy causes anomalies. We normalize to avoid insert/delete anomalies. 3NF means no transitive dependency. BCNF is Boyce Codd Normal Form.
Q3. SQL: Joining tables is done using join keyword. Inner join finds common entries. Query is select * from A, B where A.id = B.id. This is old implicit join notation.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 6,
          overrideMarks: '6',
          feedback: 'Drawn components are extremely basic. Missing details on multi-valued and composite attributes.',
          criteriaAlignment: 'Requires Review'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 6,
          overrideMarks: '6',
          feedback: 'Definitions are superficial. Failed to state formal definitions of functional dependencies.',
          criteriaAlignment: 'Requires Review'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 6,
          overrideMarks: '6',
          feedback: 'Used implicit join syntax. Query lacks modern explicit INNER JOIN keyword as required by syllabus.',
          criteriaAlignment: 'Requires Review'
        }
      ],
      conceptualGaps: [
        'Incomplete description of composite primary keys.',
        'Lacks knowledge of ANSI SQL join standards (using implicit joins).'
      ]
    },
    {
      id: 'DBMS-004',
      name: 'Divya Nair',
      rollNo: 'CSE-2026-033',
      subject: 'Database Management Systems',
      status: 'Evaluated',
      totalMarks: 27,
      maxTotal: 30,
      ocrText: `
Q1. ER Diagram: Entities represent real-world objects. Relationships represent connections. Diagram drawn includes weak entity 'Dependent' and composite attributes.
Q2. Normalization: Functional dependencies are X -> Y. BCNF condition: X must be a super key. Showed relation R(A,B,C) normalized to BCNF. Lossless join property preserved.
Q3. SQL Joins: Query written using LEFT JOIN. Showed NULL padding for unmapped rows. Correct.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Excellent entity mapping and notation accuracy.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Rigorous proof of BCNF decomposition and dependency preservation checks.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Correct query output tracing and outer join syntax.',
          criteriaAlignment: 'Meets Criterion C2'
        }
      ],
      conceptualGaps: []
    }
  ],
  CN: [
    {
      id: 'CN-001',
      name: 'Rajesh Varman',
      rollNo: 'CSE-2026-022',
      subject: 'Computer Networks',
      status: 'Ready for Review',
      totalMarks: 26,
      maxTotal: 30,
      ocrText: `
Q1. Answer:
OSI Model vs TCP/IP Model:
OSI is a 7-layer theoretical model: Physical, Data Link, Network, Transport, Session, Presentation, Application.
TCP/IP is a 4/5-layer practical model: Network Access, Internet, Transport, Application.
Differences: TCP/IP combines Session, Presentation and Application layers. OSI supports both connectionless and connection-oriented in network layer, but only connection-oriented in transport.

Q2. Answer:
Routing Algorithms:
Distance Vector (DV): Based on Bellman-Ford algorithm. Nodes share routing tables with neighbors periodically. Slow convergence, count-to-infinity problem.
Link State (LS): Based on Dijkstra's algorithm. Nodes flood link-state packets (LSPs) to all nodes. Fast convergence, complete map of network topology built.

Q3. Answer:
IPv4 Subnetting:
IP: 192.168.1.0/26. Subnet mask is 255.255.255.192.
Total subnets available: 2^2 = 4 (for 2 bits borrowed).
Hosts per subnet: 2^6 - 2 = 62 hosts.
Subnet Ranges: .0 to .63, .64 to .127, .128 to .191, .192 to .255.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Clear tabular differences between OSI and TCP/IP models. Accurate layer descriptions.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Bellman-Ford and Dijkstra comparisons are accurate. Could elaborate on split-horizon fix.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Flawless subnet range calculations and host count formulas.',
          criteriaAlignment: 'Meets Criterion C2 (Knowledge Depth)'
        }
      ],
      conceptualGaps: [
        'Omission of split-horizon route-poisoning details to resolve count-to-infinity.'
      ]
    },
    {
      id: 'CN-002',
      name: 'Ananya Roy',
      rollNo: 'CSE-2026-077',
      subject: 'Computer Networks',
      status: 'Evaluated',
      totalMarks: 22,
      maxTotal: 30,
      ocrText: `
Q1. OSI vs TCP/IP: OSI has 7 layers. TCP/IP has 4 layers. Application, Transport, Internet, Network interface.
Q2. Routing: Distance Vector uses distance vectors, sharing with neighbors. Link State floods link state packets. DV has count to infinity problem.
Q3. Subnetting: 192.168.1.0/26. Mask is 255.255.255.192. Hosts per subnet: 2^6 = 64 (forgot to subtract network and broadcast address). Ranges .0 to .64, .65 to .128.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Good basic layer comparison. Presentation/Session layer merging is noted.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Correct algorithmic associations (Bellman-Ford / Dijkstra). Convergence comparison is correct.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 6,
          overrideMarks: '6',
          feedback: 'Critical error: Failed to subtract network and broadcast addresses. Subnet ranges overlap.',
          criteriaAlignment: 'Requires Review'
        }
      ],
      conceptualGaps: [
        'IPv4 subnet calculation error in the secondary subnet mask (overlapping address ranges).'
      ]
    },
    {
      id: 'CN-003',
      name: 'Kevin D\'Souza',
      rollNo: 'CSE-2026-092',
      subject: 'Computer Networks',
      status: 'Ready for Review',
      totalMarks: 24,
      maxTotal: 30,
      ocrText: `
Q1. OSI vs TCP/IP: OSI has Physical, Data Link, Network, Transport, Session, Presentation, Application layers. TCP/IP has Application, Transport, Internet, Network Access.
Q2. Routing: DV shares vector values. LS shares topology links. LS convergence is fast, DV is slow.
Q3. Subnetting: 192.168.1.0/26. Borrowed 2 bits. Subnets = 4. Hosts per subnet = 62. Usable IP ranges computed correctly.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Layers listed and contrasted correctly.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 7,
          overrideMarks: '7',
          feedback: 'Good DV/LS routing comparisons, but did not explain why Link State requires more processing power.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Usable subnet ranges and hosts calculations are correct.',
          criteriaAlignment: 'Meets Criterion C2'
        }
      ],
      conceptualGaps: [
        'Missing TCP sliding window congestion control graph.'
      ]
    },
    {
      id: 'CN-004',
      name: 'Preeti Sen',
      rollNo: 'CSE-2026-061',
      subject: 'Computer Networks',
      status: 'Ready for Review',
      totalMarks: 24,
      maxTotal: 30,
      ocrText: `
Q1. Layer differences: OSI has 7 layers, TCP/IP has 4 layers. Physical to Application. TCP/IP is more practical.
Q2. Routing algorithms: Link State and Distance Vector. DV works on Bellman-Ford, LS works on Dijkstra.
Q3. IPv4 Subnetting: IP range 192.168.1.0/26. Subnet mask: 255.255.255.192. Borrowed bits = 2. Total subnets = 4. Usable hosts = 62.
      `,
      questions: [
        {
          qNo: 'Q1',
          maxMarks: 10,
          aiSuggestedMarks: 7,
          overrideMarks: '7',
          feedback: 'Layer structure is correct. Could provide more detail on session/presentation protocols.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q2',
          maxMarks: 10,
          aiSuggestedMarks: 9,
          overrideMarks: '9',
          feedback: 'Correct explanation of route computation differences.',
          criteriaAlignment: 'Meets Criterion C2'
        },
        {
          qNo: 'Q3',
          maxMarks: 10,
          aiSuggestedMarks: 8,
          overrideMarks: '8',
          feedback: 'Subnet boundaries and usable ranges correct.',
          criteriaAlignment: 'Meets Criterion C2'
        }
      ],
      conceptualGaps: [
        'Brief explanation of DNS hierarchy.'
      ]
    }
  ]
};

const rubricsData: Record<SubjectKey, { preset: string; items: { id: string; question: string; marks: number; keyPoints: string; }[] }> = {
  ADA: {
    preset: 'End Semester — Algorithm Design',
    items: [
      { id: 'R1', question: 'Q1. Dijkstra\'s Algorithm', marks: 10, keyPoints: 'Algorithm steps, Correct path tracing, Time Complexity.' },
      { id: 'R2', question: 'Q2. Knapsack Problem', marks: 10, keyPoints: 'Dynamic programming matrix formulation, Recurrence relation.' },
      { id: 'R3', question: 'Q3. Kruskal\'s MST', marks: 10, keyPoints: 'Greedy approach step-wise illustration, Disjoint-Set union complexity.' }
    ]
  },
  DBMS: {
    preset: 'End Semester — Database Systems',
    items: [
      { id: 'R1', question: 'Q1. E-R Model Mapping', marks: 10, keyPoints: 'Entity/Relationship definitions, Weak Entity mapping, Cardinality.' },
      { id: 'R2', question: 'Q2. Normalization Proofs', marks: 10, keyPoints: '3NF definition, BCNF criteria, Lossless join property.' },
      { id: 'R3', question: 'Q3. SQL Queries', marks: 10, keyPoints: 'INNER JOIN syntax, LEFT OUTER JOIN query formulation, grouping.' }
    ]
  },
  CN: {
    preset: 'End Semester — Computer Networks',
    items: [
      { id: 'R1', question: 'Q1. Network OSI Layering', marks: 10, keyPoints: '7-layer OSI model, Layer responsibilities, TCP/IP vs OSI.' },
      { id: 'R2', question: 'Q2. DV Routing Loops', marks: 10, keyPoints: 'Bellman-Ford equation, count-to-infinity problem, split-horizon.' },
      { id: 'R3', question: 'Q3. IPv4 Address Subnet', marks: 10, keyPoints: 'Network boundaries, usable host ranges, CIDR prefix matching.' }
    ]
  }
};

const gapsData: Record<SubjectKey, { topic: string; desc: string; rate: string; severity: 'destructive' | 'warning' | 'secondary' }[]> = {
  ADA: [
    { topic: "Dijkstra Time Complexity Analysis", desc: "Missed detailing binary heap vs array loops", rate: "18% of papers", severity: 'destructive' },
    { topic: "DSU Union by Rank Proofs", desc: "Omission of inverse Ackermann bounds", rate: "12% of papers", severity: 'warning' },
    { topic: "DP Knapsack Recurrence", desc: "Matrix grid layout errors", rate: "6% of papers", severity: 'secondary' }
  ],
  DBMS: [
    { topic: "Normalization Theory Proofs", desc: "Lacks formal functional dependency steps", rate: "22% of papers", severity: 'destructive' },
    { topic: "ER Schema Conversion Rules", desc: "Missed weak entity constraints", rate: "14% of papers", severity: 'warning' },
    { topic: "SQL Outer Join Query Syntax", desc: "Omission of proper NULL padding definition", rate: "8% of papers", severity: 'secondary' }
  ],
  CN: [
    { topic: "IPv4 Address Subnet Partitioning", desc: "Overlapping subnet mask boundary errors", rate: "20% of papers", severity: 'destructive' },
    { topic: "Distance Vector Routing Loops", desc: "Count-to-infinity split-horizon omission", rate: "15% of papers", severity: 'warning' },
    { topic: "OSI vs TCP/IP Transport Layer", desc: "Confused connectionless services mapping", rate: "10% of papers", severity: 'secondary' }
  ]
};

const aiRecommendationText: Record<SubjectKey, string> = {
  ADA: "AI recommendation: Dijkstra time-complexity and DSU implementation are the top conceptual gaps (found in 18% of papers).",
  DBMS: "AI recommendation: Normalization theory proofs and ER schema mappings are the top conceptual gaps (found in 22% of papers).",
  CN: "AI recommendation: IPv4 subnet masking boundaries and Distance Vector routing loops are the top conceptual gaps (found in 20% of papers)."
};

const virtualDistribution: Record<SubjectKey, number[]> = {
  ADA: [1, 3, 8, 14, 10], 
  DBMS: [0, 2, 6, 18, 12],
  CN: [2, 4, 10, 12, 8]
};

const switchingSteps = [
  "Ingesting handwritten exam script (OCR)...",
  "Running neural layout analysis and segmenting regions...",
  "Aligning text transcripts with grading rubric guidelines...",
  "Evaluating semantic answers & calculating proposed scores...",
  "Compiling cognitive gap annotations & final output..."
];

export default function OnlinePaperEvaluation() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Subject and scripts state
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>('ADA');
  const [scripts, setScripts] = useState<Record<SubjectKey, StudentScript[]>>(initialScriptsData);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('ADA-001');

  // Switcher overlay loader states
  const [isSwitching, setIsSwitching] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [pendingStudentId, setPendingStudentId] = useState<string>('');

  const [isRubricLoading, setIsRubricLoading] = useState(false);
  const [rubricPreset, setRubricPreset] = useState('End Semester — Algorithm Design');
  
  // Custom states for interactive mock elements
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isAiConfigExpanded, setIsAiConfigExpanded] = useState(false);
  
  // Rubric state
  const [rubricItems, setRubricItems] = useState(rubricsData);

  // AI evaluation configurations
  const [aiOptions, setAiOptions] = useState({
    plagiarismCheck: true,
    conceptualGapAnalysis: true,
    depthLevel: 'Detailed'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync rubric preset selection when subject changes
  useEffect(() => {
    setRubricPreset(rubricItems[selectedSubject].preset);
  }, [selectedSubject, rubricItems]);

  // Handle student queue switcher with 3-second loader
  const handleStudentChange = (studentId: string) => {
    if (studentId === selectedStudentId) return;
    setIsSwitching(true);
    setLoadingStep(0);
    setPendingStudentId(studentId);
    
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => prev + 1);
    }, 600);
    
    setTimeout(() => {
      clearInterval(stepInterval);
      setSelectedStudentId(studentId);
      setIsSwitching(false);
    }, 3000);
  };

  // Handle subject change switcher
  const handleSubjectChange = (subject: SubjectKey) => {
    if (subject === selectedSubject) return;
    setSelectedSubject(subject);
    const firstStudentId = scripts[subject][0]?.id || `${subject}-001`;
    
    setIsSwitching(true);
    setLoadingStep(0);
    setPendingStudentId(firstStudentId);
    
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => prev + 1);
    }, 600);
    
    setTimeout(() => {
      clearInterval(stepInterval);
      setSelectedStudentId(firstStudentId);
      setIsSwitching(false);
    }, 3000);
  };

  // Change marks on override and instantly trigger calculations
  const handleScoreOverride = (qNo: string, val: string) => {
    setScripts(prev => {
      const subjectScripts = prev[selectedSubject].map(s => {
        if (s.id !== selectedStudentId) return s;
        const updatedQuestions = s.questions.map(q => {
          if (q.qNo !== qNo) return q;
          return { ...q, overrideMarks: val };
        });
        // Recalculate totalMarks
        const total = updatedQuestions.reduce((sum, q) => sum + (parseFloat(q.overrideMarks) || 0), 0);
        return { ...s, questions: updatedQuestions, totalMarks: total };
      });
      return {
        ...prev,
        [selectedSubject]: subjectScripts
      };
    });
  };

  const handleApproveGrade = () => {
    const activeScripts = scripts[selectedSubject];
    const student = activeScripts.find(s => s.id === selectedStudentId);
    if (!student) return;
    setScripts(prev => {
      const subjectScripts = prev[selectedSubject].map(s => 
        s.id === selectedStudentId ? { ...s, status: 'Evaluated' as const } : s
      );
      return {
        ...prev,
        [selectedSubject]: subjectScripts
      };
    });
    showToast(`Marksheet approved and published for ${student.name}. Grade pushed to SIS ledger.`);
  };

  // Simulated AI Re-evaluation with 3-second loader screen
  const handleRegenerateAi = () => {
    setIsSwitching(true);
    setLoadingStep(0);
    setPendingStudentId(selectedStudentId);
    
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => prev + 1);
    }, 600);
    
    setTimeout(() => {
      clearInterval(stepInterval);
      setIsSwitching(false);
      showToast(`AI Re-evaluation complete. Regenerated scores and layout analysis for ${selectedStudent?.name}.`);
    }, 3000);
  };

  // Mock Upload Scanned Scripts
  const handleMockUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadProgress(10);
    
    // Simulate upload interval
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            
            const activeScripts = scripts[selectedSubject];
            const subjectName = selectedSubject === 'ADA' 
              ? 'Analysis & Design of Algorithms' 
              : selectedSubject === 'DBMS' 
                ? 'Database Management Systems' 
                : 'Computer Networks';

            const newScript: StudentScript = {
              id: `${selectedSubject}-00${activeScripts.length + 1}`,
              name: 'Megha Sharma',
              rollNo: 'CSE-2026-102',
              subject: subjectName,
              status: 'Ready for Review',
              totalMarks: 21,
              maxTotal: 30,
              ocrText: `
Q1. Answer: Dijkstra algorithm tracks distance. A=0, B=4, C=2. Updates path shortest.
Q2. Answer: Knapsack is greedy? No, it is DP. DP matrix calculation correct for small sample.
Q3. Answer: Kruskal sort weight. Forms tree structure.
              `,
              questions: [
                { qNo: 'Q1', maxMarks: 10, aiSuggestedMarks: 8, overrideMarks: '8', feedback: 'Steps listed correctly. Shortest paths verified.', criteriaAlignment: 'Meets criteria' },
                { qNo: 'Q2', maxMarks: 10, aiSuggestedMarks: 6, overrideMarks: '6', feedback: 'Correct formulation structure but missed complexity details.', criteriaAlignment: 'Needs improvement' },
                { qNo: 'Q3', maxMarks: 10, aiSuggestedMarks: 7, overrideMarks: '7', feedback: 'Greedy approach trace correct.', criteriaAlignment: 'Meets criteria' }
              ],
              conceptualGaps: ['Greedy vs DP algorithm distinction clear but missing complex proof logs.']
            };

            setScripts(prev => ({
              ...prev,
              [selectedSubject]: [...prev[selectedSubject], newScript]
            }));
            setSelectedStudentId(newScript.id);
            showToast(`Script "${file.name}" uploaded, OCR processed, and AI suggestions generated!`);
          }, 500);
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleGenerateAiRubric = () => {
    setIsRubricLoading(true);
    setTimeout(() => {
      setIsRubricLoading(false);
      setRubricItems(prev => {
        const currentItems = prev[selectedSubject];
        const updatedItems = currentItems.items.map(item => ({
          ...item,
          keyPoints: item.keyPoints.startsWith('AI Generated:') ? item.keyPoints : `AI Generated: ${item.keyPoints}`
        }));
        return {
          ...prev,
          [selectedSubject]: {
            ...currentItems,
            items: updatedItems
          }
        };
      });
      showToast("AI Rubric generated and loaded successfully based on syllabus.");
    }, 1500);
  };

  // Get active items based on current subject
  const activeScripts = scripts[selectedSubject];
  
  // Highlighted student ID takes care of showing the student being evaluated during switching
  const highlightedStudentId = isSwitching ? pendingStudentId : selectedStudentId;
  const selectedStudent = activeScripts.find(s => s.id === highlightedStudentId) || activeScripts[0];

  // Interlinked dynamic stats calculations
  const baseCounts = [...virtualDistribution[selectedSubject]];
  activeScripts.forEach(s => {
    if (s.status !== 'Pending AI') {
      if (s.totalMarks <= 10) baseCounts[0]++;
      else if (s.totalMarks <= 15) baseCounts[1]++;
      else if (s.totalMarks <= 20) baseCounts[2]++;
      else if (s.totalMarks <= 25) baseCounts[3]++;
      else baseCounts[4]++;
    }
  });

  const chartDataGrade = [
    { range: '0-10 (F)', Count: baseCounts[0] },
    { range: '11-15 (D)', Count: baseCounts[1] },
    { range: '16-20 (C)', Count: baseCounts[2] },
    { range: '21-25 (B)', Count: baseCounts[3] },
    { range: '26-30 (A)', Count: baseCounts[4] }
  ];

  const totalScanned = baseCounts.reduce((a, b) => a + b, 0);
  const totalEvaluated = totalScanned - activeScripts.filter(s => s.status === 'Ready for Review').length;

  const virtualCount = virtualDistribution[selectedSubject].reduce((a, b) => a + b, 0);
  const virtualWeightedSum = virtualDistribution[selectedSubject][0] * 5.5 + 
                               virtualDistribution[selectedSubject][1] * 13 + 
                               virtualDistribution[selectedSubject][2] * 18 + 
                               virtualDistribution[selectedSubject][3] * 23 + 
                               virtualDistribution[selectedSubject][4] * 28;

  const activeEvaluated = activeScripts.filter(s => s.status !== 'Pending AI');
  const activeEvaluatedCount = activeEvaluated.length;
  const activeWeightedSum = activeEvaluated.reduce((sum, s) => sum + s.totalMarks, 0);

  const overallTotalCount = virtualCount + activeEvaluatedCount;
  const overallTotalSum = virtualWeightedSum + activeWeightedSum;
  const dynamicAverage = (overallTotalSum / overallTotalCount).toFixed(1);

  const avgGradingTime = selectedSubject === 'ADA' ? '3.2 mins/paper' : selectedSubject === 'DBMS' ? '3.0 mins/paper' : '2.8 mins/paper';

  return (
    <Layout
      title="Online Paper Evaluation with AI"
      description="Process scanned handwritten sheets, configure grading rubrics, and verify question-by-question AI evaluation suggestions"
      icon={Brain}
      showHome={true}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{totalScanned}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Scanned Scripts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-600">{totalEvaluated}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Graded & Published</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{avgGradingTime}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Grading Cycle</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 rounded-md text-blue-700">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{dynamicAverage} / 30</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Dual Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        
        {/* Left Column: Subject Switcher, Config Panel & Scripts List */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Subject Switcher Card */}
          <Card className="shadow-sm border-slate-200">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Select Course / Subject</h3>
              <Badge className="bg-blue-600 text-white border-none py-0.5 px-2 text-[9px] font-bold uppercase">
                {selectedSubject}
              </Badge>
            </div>
            <CardContent className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {(['ADA', 'DBMS', 'CN'] as SubjectKey[]).map((sub) => {
                  const labels = {
                    ADA: 'Algorithms',
                    DBMS: 'Database',
                    CN: 'Networks'
                  };
                  const isActive = selectedSubject === sub;
                  return (
                    <button
                      key={sub}
                      onClick={() => handleSubjectChange(sub)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-blue-50 border-blue-300 text-blue-755 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {labels[sub]}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <Card className="shadow-sm border-slate-200">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-2.5 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Upload Answer Scripts</h3>
            </div>
            <CardContent className="p-4">
              <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-5 hover:bg-slate-50/50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
                <input
                  type="file"
                  id="script-uploader"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleMockUpload}
                  disabled={uploadProgress !== null}
                />
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Drag & drop scanned PDF bundle</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports multi-page scanned scripts (PDF/TIFF)</p>
                
                {uploadProgress !== null && (
                  <div className="w-full mt-3">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Uploading & Processing OCR...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 transition-all" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rubric Configuration Setup */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Evaluation Rubrics</CardTitle>
                <CardDescription className="text-[10px]">Define answer marking thresholds</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[10px] text-blue-600 font-bold hover:bg-blue-50 py-0.5 px-2"
                onClick={handleGenerateAiRubric}
                disabled={isRubricLoading}
              >
                {isRubricLoading ? 'Generating...' : 'Generate with AI'}
              </Button>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Preset</Label>
                <select
                  value={rubricPreset}
                  onChange={e => setRubricPreset(e.target.value)}
                  className="w-full h-8 border border-slate-200 rounded-md px-2 bg-white text-xs"
                >
                  <option>{rubricItems[selectedSubject].preset}</option>
                  <option>Midterm — Standard Template</option>
                  <option>Unit Test 2 — Custom Rubric</option>
                </select>
              </div>

              {/* Rubric items list */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {rubricItems[selectedSubject].items.map((item) => (
                  <div key={item.id} className="p-2 border border-slate-100 bg-slate-50/50 rounded text-[10px]">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{item.question}</span>
                      <span className="text-blue-600">Max: {item.marks} M</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">
                      <strong>Rubric:</strong> {item.keyPoints}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Settings Expandable Options */}
          <Card className="shadow-sm border-slate-200">
            <div
              className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between cursor-pointer"
              onClick={() => setIsAiConfigExpanded(!isAiConfigExpanded)}
            >
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <Settings className="w-4 h-4 text-slate-400" />
                AI Grading Agent Parameters
              </h3>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isAiConfigExpanded ? 'rotate-90' : ''}`} />
            </div>
            {isAiConfigExpanded && (
              <CardContent className="p-3 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={aiOptions.plagiarismCheck}
                    onChange={e => setAiOptions(prev => ({ ...prev, plagiarismCheck: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>Run Plagiarism & Peer Copier check</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={aiOptions.conceptualGapAnalysis}
                    onChange={e => setAiOptions(prev => ({ ...prev, conceptualGapAnalysis: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>Perform Cognitive Gap mapping</span>
                </label>
                <div className="space-y-1 mt-1.5">
                  <Label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Evaluation Depth</Label>
                  <select
                    value={aiOptions.depthLevel}
                    onChange={e => setAiOptions(prev => ({ ...prev, depthLevel: e.target.value }))}
                    className="w-full h-8 border border-slate-200 rounded-md px-2 bg-white text-xs"
                  >
                    <option>Detailed Feedback</option>
                    <option>Standard Checklist</option>
                    <option>Score-Only</option>
                  </select>
                </div>
              </CardContent>
            )}
          </Card>

        </div>

        {/* Right Column: AI Grading Desk & OCR Script (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Student selection queue row */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="py-2.5 px-3 flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Queue:</span>
              </div>
              <div className="flex gap-2">
                {activeScripts.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStudentChange(s.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${highlightedStudentId === s.id ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Evaluated' ? 'bg-emerald-500' : s.status === 'Pending AI' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`} />
                    {s.name} ({s.rollNo.split('-')[2]})
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative min-h-[480px]">
              
              {/* Glassmorphic overlay loader when student switching */}
              {isSwitching && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-lg border border-slate-200">
                  <div className="flex flex-col items-center max-w-sm text-center p-6 space-y-4">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Evaluation Engine Running</p>
                      <p className="text-xs font-semibold text-blue-600 transition-all duration-300">
                        {switchingSteps[Math.min(loadingStep, switchingSteps.length - 1)]}
                      </p>
                    </div>
                    <div className="w-48 bg-slate-100 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-1 transition-all duration-300" 
                        style={{ width: `${((loadingStep + 1) / switchingSteps.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* OCR Handwritten Extractions Screen */}
              <Card className="shadow-sm border-slate-200 flex flex-col h-[480px]">
                <div className="bg-slate-900 text-slate-300 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    OCR Script Extraction
                  </h3>
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700 py-0.5 px-2 text-[9px]">
                    {selectedStudent.rollNo}
                  </Badge>
                </div>
                <CardContent className="p-0 flex-1 overflow-y-auto bg-slate-950 font-mono text-[11px] leading-relaxed p-4 text-slate-300 whitespace-pre-wrap select-all">
                  {selectedStudent.ocrText}
                </CardContent>
              </Card>

              {/* AI Grading & Score Editor Panel */}
              <Card className="shadow-sm border-slate-200 flex flex-col h-[480px]">
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                      <Brain className="w-4 h-4 text-blue-600" />
                      AI Scoring Feed Desk
                    </h3>
                  </div>
                  
                  {/* Total score box */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Marks:</span>
                    <span className="text-sm font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {selectedStudent.totalMarks} / {selectedStudent.maxTotal}
                    </span>
                  </div>
                </div>

                <CardContent className="p-3 flex-1 overflow-y-auto space-y-3.5">
                  {selectedStudent.status === 'Pending AI' ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Running AI Evaluation Script...</p>
                      <p className="text-[10px] text-slate-400 mt-1">Synthesizing OCR text and comparing against scoring rubric definitions.</p>
                    </div>
                  ) : (
                    <>
                      {/* Gaps detected alerts */}
                      {selectedStudent.conceptualGaps.length > 0 && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-[10px] font-medium text-rose-800 flex items-start gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Identified Conceptual Gaps:</span>
                            <ul className="list-disc pl-3.5 mt-1 space-y-0.5 font-semibold text-rose-700">
                              {selectedStudent.conceptualGaps.map((gap, i) => (
                                <li key={i}>{gap}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Question evaluation list */}
                      <div className="space-y-3">
                        {selectedStudent.questions.map((q) => (
                          <div key={q.qNo} className="p-2.5 border border-slate-100 bg-slate-50/50 rounded-lg text-[11px] leading-relaxed">
                            <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-slate-100 pb-1">
                              <span className="font-bold text-slate-800">{q.qNo} | Rubric Threshold: {q.maxMarks}M</span>
                              <span className="text-[10px] text-slate-400 font-semibold uppercase">{q.criteriaAlignment}</span>
                            </div>
                            
                            <p className="text-slate-500 mb-2 leading-relaxed">
                              <strong>AI Feedback:</strong> {q.feedback}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                              <span className="text-[10px] text-slate-500 font-medium">
                                AI Proposed: <strong className="text-blue-700">{q.aiSuggestedMarks} Marks</strong>
                              </span>
                              
                              <div className="flex items-center gap-1.5">
                                <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Final Marks:</Label>
                                <input
                                  type="number"
                                  min={0}
                                  max={q.maxMarks}
                                  value={q.overrideMarks}
                                  onChange={e => handleScoreOverride(q.qNo, e.target.value)}
                                  className="w-12 h-7 border border-slate-200 rounded text-center text-xs font-bold bg-white focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>

                {/* Desk Footer Actions */}
                {selectedStudent.status !== 'Pending AI' && (
                  <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-white"
                      onClick={handleRegenerateAi}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" />
                      Regenerate AI
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleApproveGrade}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Approve & Publish Grade
                    </Button>
                  </div>
                )}
              </Card>

            </div>
          )}

        </div>

      </div>

      {/* Batch Analytics Bar Chart */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-slate-800">Batch-Level Grading Analytics</CardTitle>
            <CardDescription className="text-xs">Aggregate score distribution and conceptual weak-points across {totalScanned} uploaded scripts</CardDescription>
          </div>
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{aiRecommendationText[selectedSubject]}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chart */}
            <div className="md:col-span-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Overall Grade Distribution</h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartDataGrade}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      formatter={(value: any) => [value, 'Scripts']}
                      contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '6px', fontSize: '10px' }}
                    />
                    <Bar dataKey="Count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List of common errors */}
            <div className="md:col-span-1 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Conceptual Gaps Detected</h4>
              <div className="space-y-2">
                {gapsData[selectedSubject].map((gap, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-100 rounded text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800 text-[11px]">{gap.topic}</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{gap.desc}</p>
                    </div>
                    <Badge 
                      variant={gap.severity} 
                      className="py-0 px-1 text-[9px] shrink-0 font-medium"
                    >
                      {gap.rate}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
