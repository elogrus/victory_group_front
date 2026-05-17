"use client";

import { useCallback, useEffect, useState } from "react";
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
import { CONSTS } from "@/shared/lib/consts";
import { myFetch } from "@/shared/lib/myFetch";
import { ChevronDown, ChevronUp, FolderDot, Shield, User, Loader2 } from "lucide-react";

// --- ИНТЕРФЕЙС ДЛЯ ТИПИЗАЦИИ ДАННЫХ УЗЛА ---
interface NodeData extends Record<string, unknown> {
    id: string;
    label: string;
    type: "project" | "role" | "user";
    tg_id?: number | null;
    expanded?: boolean;
    onToggle?: (id: string) => void;
}

// --- КАСТОМНЫЙ УЗЕЛ ---
const CustomNode = ({ data }: NodeProps<NodeData>) => {
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
                        <div className="font-bold text-foreground text-sm">{data.label}</div>
                        {!isProject && !isRole && (
                            <div className="text-xs text-muted-foreground mt-1">
                                {data.tg_id ? `TG: ${data.tg_id}` : "Нет контакта"}
                            </div>
                        )}
                    </div>
                </div>

                {/* Кнопка раскрытия (только для проектов и ролей, у пользователей детей нет) */}
                {(isProject || isRole) && (
                    <button
                        onClick={(e) => { e.stopPropagation(); data.onToggle?.(data.id); }}
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
    const [projectHierarchy, setProjectHierarchy] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка данных с бэкенда
    useEffect(() => {
        const loadProjects = async () => {
            try {
                setIsLoading(true);
                const res = await myFetch<any[]>(`${CONSTS.API_URL}/projects/minedmap`);
                
                if (!res.ok || !res.body) {
                    setError("Ошибка загрузки проектов");
                    return;
                }

                // Трансформация данных: группируем members по role.name
                const hierarchy: Record<string, any> = {};
                
                res.body.forEach((project: any) => {
                    // Группируем members по role
                    const membersByRole = new Map<string, any[]>();
                    
                    project.members?.forEach((member: any) => {
                        const roleName = member.role?.name || "unknown";
                        if (!membersByRole.has(roleName)) {
                            membersByRole.set(roleName, []);
                        }
                        membersByRole.get(roleName)!.push(member);
                    });

                    // Строим иерархию: проект -> роли -> члены команды
                    const roleChildren = Array.from(membersByRole.entries()).map(([roleName, members]) => ({
                        id: `role-${project.id}-${roleName}`,
                        name: roleName.charAt(0).toUpperCase() + roleName.slice(1),
                        type: "role",
                        children: members.map((member: any) => ({
                            id: `user-${member.id}`,
                            name: member.name,
                            login: member.login,
                            email: `${member.login}@example.com`, // Если не приходит email
                            type: "user",
                            tg_id: member.tg_id || 0
                        }))
                    }));

                    hierarchy[`proj-${project.id}`] = {
                        id: `proj-${project.id}`,
                        name: project.name,
                        description: project.description,
                        type: "project",
                        children: roleChildren
                    };
                });

                setProjectHierarchy(hierarchy);
                setError(null);
            } catch (err) {
                setError("Ошибка загрузки данных");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Рекурсивный поиск детей в данных
    const findNodeData = (id: string, hierarchy: any = Object.values(projectHierarchy)): any | null => {
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
    const getAllDescendantIds = (nodeId: string, currentHierarchy: any = Object.values(projectHierarchy)): string[] => {
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
                const descendantsToRemove = getAllDescendantIds(nodeId, Object.values(projectHierarchy));
                
                setEdges(eds => eds.filter(e => !descendantsToRemove.includes(e.target)));
                
                return nds
                    .filter(n => !descendantsToRemove.includes(n.id))
                    .map(n => n.id === nodeId ? { ...n, data: { ...n.data, expanded: false } } : n);
            } else {
                // РАЗВОРАЧИВАНИЕ: Добавляем только прямых детей
                const nodeData = findNodeData(nodeId, Object.values(projectHierarchy));
                if (!nodeData || !nodeData.children) return nds;

                const newNodes: Node[] = [];
                const newEdges: Edge[] = [];

                nodeData.children.forEach((child: any, idx: number) => {
                    newNodes.push({
                        id: child.id,
                        type: "custom",
                        position: { 
                            x: node.position.x + (idx * 280) - ((nodeData.children.length - 1) * 140), 
                            y: node.position.y + 150 
                        },
                        data: { 
                            id: child.id, 
                            label: child.name, 
                            type: child.type, 
                            email: child.email,
                            tg_id: child.tg_id,
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
    }, [projectHierarchy, setNodes, setEdges]);

    // Обновляем nodes когда загружена иерархия проектов
    useEffect(() => {
        if (Object.keys(projectHierarchy).length === 0) {
            setNodes([]);
            return;
        }

        const initialNodes: Node[] = Object.values(projectHierarchy).map((proj: any, idx: number) => ({
            id: proj.id,
            type: "custom",
            position: { x: 400 * idx, y: 100 },
            data: { id: proj.id, label: proj.name, type: proj.type, expanded: false, onToggle: (id: string) => handleToggle(id) }
        }));

        setNodes(initialNodes);
        setEdges([]);
    }, [projectHierarchy, handleToggle, setNodes, setEdges]);

    return (
        <div className="w-full h-full bg-background relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-sm text-muted-foreground">Загрузка проектов...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            {!isLoading && !error && Object.keys(projectHierarchy).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground">Нет доступных проектов</p>
                    </div>
                </div>
            )}

            {!isLoading && !error && Object.keys(projectHierarchy).length > 0 && (
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    translateExtent={[[-2000, -2000], [4000, 4000]]}
                    nodeExtent={[[-2000, -2000], [4000, 4000]]}
                    minZoom={0.2}
                >
                    <Background color="#555" gap={16} />
                    <Controls className="bg-card border border-border fill-foreground" />
                </ReactFlow>
            )}
        </div>
    );
}