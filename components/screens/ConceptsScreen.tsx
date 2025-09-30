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

  const drawKnowledgeGraph = useCallback(() => {
    if (!svgRef.current) {
      return;
    }

    // Check if d3 is available
    if (typeof d3 === 'undefined') {
      console.warn('D3.js is not loaded. Knowledge graph cannot be rendered.');
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 600;
    const height = 400;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const nodes = concepts.map((concept) => ({ id: concept.id, title: concept.title, mastery: concept.mastery }));
    const links: Array<{ source: string; target: string }> = [];

    concepts.forEach((concept) => {
      concept.prereqIds.forEach((prereqId) => {
        links.push({ source: prereqId, target: concept.id });
      });
    });

    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((datum: any) => datum.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    svg
      .append('defs')
      .append('marker')
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

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('marker-end', 'url(#arrowhead)');

    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag()
          .on('start', (event: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on('drag', (event: any) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on('end', (event: any) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }),
      );

    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (datum: any) => {
        const hue = datum.mastery * 120;
        return `hsl(${hue}, 70%, 50%)`;
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node
      .append('text')
      .text((datum: any) => datum.title)
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .attr('class', 'text-sm fill-current text-gray-700 dark:text-gray-300');

    node
      .append('text')
      .text((datum: any) => `${Math.round(datum.mastery * 100)}%`)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('class', 'text-xs fill-white font-bold');

    simulation.on('tick', () => {
      link
        .attr('x1', (datum: any) => datum.source.x)
        .attr('y1', (datum: any) => datum.source.y)
        .attr('x2', (datum: any) => datum.target.x)
        .attr('y2', (datum: any) => datum.target.y);

      node.attr('transform', (datum: any) => `translate(${datum.x},${datum.y})`);
    });
  }, [concepts]);

  const loadConcepts = useCallback(async () => {
    try {
      const loadedConcepts = await db.getAllConcepts();
      setConcepts(loadedConcepts);
    } catch (error) {
      console.error('Failed to load concepts:', error);
      showToast('개념 로드에 실패했어요.', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadConcepts();
  }, [loadConcepts]);

  useEffect(() => {
    if (concepts.length > 0 && typeof d3 !== 'undefined') {
      drawKnowledgeGraph();
    }
  }, [concepts, drawKnowledgeGraph]);

  const handleAddConcept = async () => {
    if (!newConceptTitle.trim()) {
      showToast('개념 이름을 입력해주세요.', 'error');
      return;
    }

    try {
      const newConcept: Concept = {
        id: `concept_${Date.now()}`,
        title: newConceptTitle,
        prereqIds: selectedPrereqs,
        mastery: 0,
      };

      await db.addConcept(newConcept);
      setNewConceptTitle('');
      setSelectedPrereqs([]);
      await loadConcepts();
      showToast('개념이 추가되었어요.', 'success');
    } catch (error) {
      console.error('Failed to add concept:', error);
      showToast('개념 추가에 실패했어요.', 'error');
    }
  };

  const handleDeleteConcept = async (conceptId: string) => {
    if (!window.confirm('이 개념을 삭제하시겠습니까?')) return;

    try {
      await db.deleteConcept(conceptId);
      await loadConcepts();
      showToast('개념이 삭제되었어요.', 'success');
    } catch (error) {
      console.error('Failed to delete concept:', error);
      showToast('개념 삭제에 실패했어요.', 'error');
    }
  };

  const togglePrereq = (conceptId: string) => {
    setSelectedPrereqs((prev) => (prev.includes(conceptId) ? prev.filter((id) => id !== conceptId) : [...prev, conceptId]));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">개념 관리 & 지식 그래프</h2>

      {/* Knowledge Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-2">지식 그래프</h3>
        {typeof d3 === 'undefined' ? (
          <div className="w-full h-96 border border-gray-200 dark:border-gray-600 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">D3.js 라이브러리가 로드되지 않았습니다.</p>
          </div>
        ) : (
          <svg
            ref={svgRef}
            className="w-full h-96 border border-gray-200 dark:border-gray-600 rounded"
            style={{ background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)' }}
          />
        )}
      </div>

      {/* Add New Concept */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
        <h3 className="text-md font-medium text-gray-600 dark:text-gray-400 mb-3">새 개념 추가</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newConceptTitle}
            onChange={(event) => setNewConceptTitle(event.target.value)}
            placeholder="개념 이름"
            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 dark:text-white"
          />

          {concepts.length > 0 && (
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">선행 개념 선택 (복수 선택 가능)</label>
              <div className="flex flex-wrap gap-2">
                {concepts.map((concept) => (
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

          <button onClick={handleAddConcept} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition-colors">
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
            {concepts.map((concept) => (
              <div key={concept.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{concept.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    숙련도 {Math.round(concept.mastery * 100)}%
                    {concept.prereqIds.length > 0 && <span className="ml-2">| 선행 개념: {concept.prereqIds.length}개</span>}
                  </p>
                </div>
                <button onClick={() => handleDeleteConcept(concept.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors">
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
