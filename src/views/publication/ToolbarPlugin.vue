<script setup>

	import {
		$getNodeByKey,
		$getSelection,
		$isRangeSelection,
		CAN_REDO_COMMAND,
		CAN_UNDO_COMMAND,
		FORMAT_TEXT_COMMAND,
		REDO_COMMAND,
		SELECTION_CHANGE_COMMAND,
		UNDO_COMMAND,
	} from 'lexical'
	import {
		$isParentElementRTL,
		$isAtNodeEnd,
	} from '@lexical/selection'
	import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
	import { useEditor } from 'lexical-vue'
	import { onMounted, onUnmounted, ref, watch } from 'vue'
	import { $isListNode, ListNode } from '@lexical/list'
	import { $isHeadingNode } from '@lexical/rich-text'
	import {
		$isCodeNode,
		getDefaultCodeLanguage,
	} from '@lexical/code'
	import { $isLinkNode } from '@lexical/link'

	const LowPriority = 1
	const toolbarRef = ref(null)
	const editor = useEditor()
	const canUndo = ref(false)
	const canRedo = ref(false)
	const blockType = ref('paragraph')
	const selectedElementKey = ref()
	const codeLanguage = ref('')
	const isRTL = ref(false)
	const isLink = ref(false)
	const isBold = ref(false)
	const isItalic = ref(false)
	const isUnderline = ref(false)
	const isStrikethrough = ref(false)
	const isCode = ref(false)

	function getSelectedNode(selection) {
		const anchor = selection.anchor
		const focus = selection.focus
		const anchorNode = selection.anchor.getNode()
		const focusNode = selection.focus.getNode()
		if (anchorNode === focusNode)
			return anchorNode

		const isBackward = selection.isBackward()
		if (isBackward)
			return $isAtNodeEnd(focus) ? anchorNode : focusNode
		else
			return $isAtNodeEnd(anchor) ? focusNode : anchorNode
	}

	const updateToolbar = () => {
		const selection = $getSelection()
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode()
			const element
				= anchorNode.getKey() === 'root'
					? anchorNode
					: anchorNode.getTopLevelElementOrThrow()
			const elementKey = element.getKey()
			const elementDOM = editor.getElementByKey(elementKey)
			if (elementDOM !== null) {
				selectedElementKey.value = elementKey
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType(anchorNode, ListNode)
					blockType.value = parentList ? parentList.getTag() : element.getTag()
				}
				else {
					blockType.value = $isHeadingNode(element)
						// @ts-expect-error: Missing internal types
						? element.getTag()
						: element.getType()
					if ($isCodeNode(element))
						codeLanguage.value = element.getLanguage() || getDefaultCodeLanguage()
				}
			}
			// Update text format
			isBold.value = selection.hasFormat('bold')
			isItalic.value = selection.hasFormat('italic')
			isUnderline.value = selection.hasFormat('underline')
			isStrikethrough.value = selection.hasFormat('strikethrough')
			isCode.value = selection.hasFormat('code')
			isRTL.value = $isParentElementRTL(selection)

			// Update links
			const node = getSelectedNode(selection)
			const parent = node.getParent()
			if ($isLinkNode(parent) || $isLinkNode(node))
				isLink.value = true
			else
				isLink.value = false
		}
	}

	let unregisterMergeListener

	onMounted(() => {
		unregisterMergeListener = mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar()
				})
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				() => {
					updateToolbar()
					return false
				},
				LowPriority,
			), editor.registerCommand(
				CAN_UNDO_COMMAND,
				(payload) => {
					canUndo.value = payload
					return false
				},
				LowPriority,
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				(payload) => {
					canRedo.value = payload
					return false
				},
				LowPriority,
			))
	})

	watch(codeLanguage, (value) => {
		editor.update(() => {
			if (selectedElementKey.value) {
				const node = $getNodeByKey(selectedElementKey.value)
				if ($isCodeNode(node))
					node.setLanguage(value)
			}
		})
	})

	onUnmounted(() => {
		unregisterMergeListener?.()
	})
</script>

<template>
	<div ref="toolbarRef" class="toolbar">
		<template v-if="true">
			<button :class="`toolbar-item spaced ${isBold ? 'active' : ''}`" aria-label="Format Bold"
				@click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')">
				<i class="format bold" />
			</button>

			<button :class="`toolbar-item spaced ${isItalic ? 'active' : ''}`" aria-label="Format Italics"
				@click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')">
				<i class="format italic" />
			</button>

			<button :class="`toolbar-item spaced ${isCode ? 'active' : ''}`" aria-label="Insert Code"
				@click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')">
				<i class="format code" />
			</button>

			<div class="divider"></div>

			<button :disabled="!canUndo" class="toolbar-item spaced" aria-label="Undo"
				@click="editor.dispatchCommand(UNDO_COMMAND, undefined)">
				<i class="format undo" />
			</button>
			<button :disabled="!canRedo" class="toolbar-item spaced" aria-label="Redo"
				@click="editor.dispatchCommand(REDO_COMMAND, undefined)">
				<i class="format redo" />
			</button>

		</template>
	</div>
</template>
