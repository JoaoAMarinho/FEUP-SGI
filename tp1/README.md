# SGI 2022/2023 - TP1

## Group: T04G11

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Beatriz Aguiar   | 201906230 | up201906230@fe.up.pt |
| João Marinho     | 201905952 | up201905952@fe.up.pt |

----
## Project information

Main implementation points:
- Successful implementation of all proposed features
- Verification and removal of "back edges" which introduce cycles in the given graph
- Single validation of graph components, meaning no further conditional statements need to be executed when displaying each node, i.e., unused components defined in the XML file are removed from the graph before starting the display process

Scene:
- Can be described as a recreation of the Solar System. Contains all of it's planets, the sun, and a realistic sattelite.  
- [Scene link](./scenes/space.xml)
----
## Issues/Problems

Most relevant problems and how they were solved:

- Problem: An early implementation of the file parsing did not allow for child components to be defined after the parent component, as a consequence of the order in which the components were traversed
Solution: To face the above challenge and have a well-implemented solution we decided to verify the component existence only after traversing all nodes, but with the caveat of doing it before displaying the latter
- Problem: The use of the lights presented to be one of our main issues, specifically the difference between 'omni' and 'spot' ones. These types of lights seemed to be implemented with some bugs since the linear and quadratic attenuation values did not differ, therefore difficulting the way ou 'Sun' would irradiate each planet
