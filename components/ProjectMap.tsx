"use client";

import { useCallback } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    NodeProps,
    Edge,
    Node
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { PROJECT_HIERARCHY } from "@/shared/lib/data";
import { ChevronDown, ChevronUp, FolderDot, Shield, User } from "lucide-react";

// --- КАСТОМНЫЙ УЗЕЛ ---
const CustomNode = ({ data }: NodeProps) => {
    const isProject = data.type === "project";
    const isRole = data.type === "role"; // Теперь желтые карточки это роли (Admin, Member, Viewer)

    return (
        <div className={`px-4 py-3 shadow-md rounded-lg border-2 bg-card min-w-[220px] transition-all hover:shadow-lg ${isProject ? "border-blue-500" : isRole ? "border-yellow-500" : "border-green-500"}`}>
            {/* Точка входа (сверху) */}
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-muted-foreground border-none" />
            
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {/* Синяя папка для проектов */}
                    {isProject && <FolderDot className="w-5 h-5 text-blue-500" />}
                    {/* Желтый щит для ролей */}
                    {isRole && <Shield className="w-5 h-5 text-yellow-500" />}
                    {/* Зеленый юзер для конкретных людей */}
                    {!isProject && !isRole && <User className="w-5 h-5 text-green-500" />}
                    
                    <div>
                        <div className="font-bold text-foreground text-sm">{data.label as string}</div>
                        {data.email && <div className="text-xs text-muted-foreground">{data.email as string}</div>}
                    </div>
                </div>

                {/* Кнопка раскрытия (только для проектов и ролей, у пользователей детей нет) */}
                {(isProject || isRole) && (
                    <button
                        onClick={(e) => { e.stopPropagation(); (data.onToggle as any)(data.id); }}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20 text-foreground transition-colors"
                    >
                        {data.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {/* Точка выхода (снизу) */}
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-muted-foreground border-none" />
        </div>
    );
};

const nodeTypes = { custom: CustomNode };

export function ProjectMap() {
    // Инициализация только корневыми проектами
    const initialNodes: Node[] = Object.values(PROJECT_HIERARCHY).map((proj: any, idx: number) => ({
        id: proj.id,
        type: "custom",
        position: { x: 400 * idx, y: 100 }, // Проекты стоят в ряд по горизонтали
        data: { id: proj.id, label: proj.name, type: proj.type, expanded: false, onToggle: (id: string) => handleToggle(id) }
    }));

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Рекурсивный поиск детей в данных
    const findNodeData = (id: string, hierarchy: any = Object.values(PROJECT_HIERARCHY)): any | null => {
        for (const item of hierarchy) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findNodeData(id, item.children);
                if (found) return found;
            }
        }
        return null;
    };

    // Получить ВСЕХ потомков узла (для полного скрытия ветки)
    const getAllDescendantIds = (nodeId: string, currentHierarchy: any): string[] => {
        let descendants: string[] = [];
        const nodeData = findNodeData(nodeId, currentHierarchy);
        if (nodeData && nodeData.children) {
            nodeData.children.forEach((child: any) => {
                descendants.push(child.id);
                descendants = descendants.concat(getAllDescendantIds(child.id, currentHierarchy));
            });
        }
        return descendants;
    };

    const handleToggle = useCallback((nodeId: string) => {
        setNodes((nds) => {
            const nodeIndex = nds.findIndex(n => n.id === nodeId);
            if (nodeIndex === -1) return nds;

            const node = nds[nodeIndex];
            const isExpanded = node.data.expanded;

            if (isExpanded) {
                // СВОРАЧИВАНИЕ: Удаляем все дочерние узлы и их связи
                const descendantsToRemove = getAllDescendantIds(nodeId, Object.values(PROJECT_HIERARCHY));
                
                setEdges(eds => eds.filter(e => !descendantsToRemove.includes(e.target)));
                
                return nds
                    .filter(n => !descendantsToRemove.includes(n.id))
                    .map(n => n.id === nodeId ? { ...n, data: { ...n.data, expanded: false } } : n);
            } else {
                // РАЗВОРАЧИВАНИЕ: Добавляем только прямых детей
                const nodeData = findNodeData(nodeId);
                if (!nodeData || !nodeData.children) return nds;

                const newNodes: Node[] = [];
                const newEdges: Edge[] = [];

                nodeData.children.forEach((child: any, idx: number) => {
                    newNodes.push({
                        id: child.id,
                        type: "custom",
                        // Позиционируем вниз (y + 150) и распределяем по ширине (x)
                        position: { 
                            x: node.position.x + (idx * 280) - ((nodeData.children.length - 1) * 140), 
                            y: node.position.y + 150 
                        },
                        data: { 
                            id: child.id, 
                            label: child.name, 
                            type: child.type, 
                            email: child.email, // Прокидываем email для карточки пользователя
                            expanded: false, 
                            onToggle: (id: string) => handleToggle(id) 
                        }
                    });
                    newEdges.push({
                        id: `e-${nodeId}-${child.id}`,
                        source: nodeId,
                        target: child.id,
                        animated: true,
                        style: { stroke: '#888', strokeWidth: 2 }
                    });
                });

                setEdges(eds => [...eds, ...newEdges]);
                return nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, expanded: true } } : n).concat(newNodes);
            }
        });
    }, [setNodes, setEdges]);

    return (
        <div className="w-full h-full bg-background relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                translateExtent={[[-2000, -2000], [4000, 4000]]} // Ограничение панорамирования
                nodeExtent={[[-2000, -2000], [4000, 4000]]} // Ограничение перетаскивания узлов
                minZoom={0.2}
            >
                <Background color="#555" gap={16} />
                <Controls className="bg-card border border-border fill-foreground" />
            </ReactFlow>
        </div>
    );
}