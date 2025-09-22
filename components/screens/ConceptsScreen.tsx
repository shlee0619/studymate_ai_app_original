import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../../services/db';
import type { Concept } from '../../types';
import { useToast } from '../../contexts/ToastContext';

declare const d3: any;

export const ConceptsScreen: React.FC = () => {
  const { showToast } = useToast();
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [newConceptTitle, setNewConceptTitle] = useState('');
  const [selectedPrereqs, setSelectedPrereqs] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const loadConcepts = useCallback(async () => {
    try {
      const loadedConcepts = await db.getAllConcepts();
      setConcepts(loadedConcepts);
    } catch (error) {
      console.error('Failed to load concepts:', error);
      showToast('개념 로드에 실패했습니다.', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  useEffect(() => {
    if (concepts.length > 0 && svgRef.current && typeof d3 !== 'undefined') {
      drawKnowledgeGraph();
    }
  }, [concepts, drawKnowledgeGraph]);

  const drawKnowledgeGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current?.clientWidth || 600;
    const height = 400;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Create nodes and links data
    const nodes = concepts.map(c => ({ id: c.id, title: c.title, mastery: c.mastery }));
    const links: any[] = [];
    
    concepts.forEach(concept => {
      concept.prereqIds.forEach(prereqId => {
        links.push({ source: prereqId, target: concept.id });
      });
    });

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Add arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // Add nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => {
        const hue = d.mastery * 120; // 0 = red, 120 = green
        return `hsl(${hue}, 70%, 50%)`;
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .text((d: any) => d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .attr('class', 'text-sm fill-current text-gray-700 dark:text-gray-300');

    // Add mastery percentage
    node.append('text')
      .text((d: any) => `${Math.round(d.mastery * 100)}%`)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('class', 'text-xs fill-white font-bold');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragEnded(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [concepts]);

  const handleAddConcept = async () => {
    if (!newConceptTitle.trim()) {
      showToast('개념 제목을 입력해주세요.', 'error');
      return;
    }

    try {
      const newConcept: Concept = {
        id: `concept_${Date.now()}`,
        title: newConceptTitle,
        prereqIds: selectedPrereqs,
        mastery: 0
      };
      
      await db.addConcept(newConcept);
      setNewConceptTitle('');
      setSelectedPrereqs([]);
      await loadConcepts();
      showToast('개념이 추가되었습니다.', 'success');
    } catch (error) {
      console.error('Failed to add concept:', error);
      showToast('개념 추가에 실패했습니다.', 'error');
    }
  };

  const handleDeleteConcept = async (conceptId: string) => {
    if (!window.confirm('이 개념을 삭제하시겠습니까?')) return;

    try {
      await db.deleteConcept(conceptId);
      await loadConcepts();
      showToast('개념이 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('Failed to delete concept:', error);
      showToast('개념 삭제에 실패했습니다.', 'error');
    }
  };

  const togglePrereq = (conceptId: string) => {
    setSelectedPrereqs(prev => 
      prev.includes(conceptId) 
        ? prev.filter(id => id !== conceptId)
        : [...prev, conceptId]
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">개념 관리 및 지식 그래프</h2>
      
      {/* Knowledge Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-2">지식 그래프</h3>
        <svg 
          ref={svgRef} 
          className="w-full h-96 border border-gray-200 dark:border-gray-600 rounded"
          style={{ background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)' }}
        />
      </div>

      {/* Add New Concept */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-3">새 개념 추가</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newConceptTitle}
            onChange={(e) => setNewConceptTitle(e.target.value)}
            placeholder="개념 제목"
            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-white"
          />
          
          {concepts.length > 0 && (
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">선수 개념 선택 (선택사항)</label>
              <div className="flex flex-wrap gap-2">
                {concepts.map(concept => (
                  <button
                    key={concept.id}
                    onClick={() => togglePrereq(concept.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedPrereqs.includes(concept.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {concept.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddConcept}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors"
          >
            개념 추가
          </button>
        </div>
      </div>

      {/* Concepts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-3">개념 목록</h3>
        {concepts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">등록된 개념이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {concepts.map(concept => (
              <div key={concept.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{concept.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    숙련도: {Math.round(concept.mastery * 100)}%
                    {concept.prereqIds.length > 0 && (
                      <span className="ml-2">
                        | 선수 개념: {concept.prereqIds.length}개
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteConcept(concept.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};