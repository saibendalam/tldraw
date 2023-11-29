import { useState } from 'react'
import { Button } from "@/components/ui/button"
import './App.css'
import { Tldraw, track, useEditor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useYjsStore } from './lib/useYjsStore'
const HOST_URL =
	import.meta.env.MODE === 'development'
		? 'ws://172.17.13.161:1234/collaboration'
		: 'wss://'+window.location.hostname+'/collaboration'

function App() {
	const store = useYjsStore({
		roomId: 'example17',
		hostUrl: HOST_URL,
		
	})


  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Tldraw autoFocus store={store} shareZone={<NameEditor />} />
    </div>
  )
}

const NameEditor = track(() => {
	const editor = useEditor()

	const { color, name } = editor.user

	return (
		<div style={{ pointerEvents: 'all', display: 'flex' }}>
			
			<input
				type="color"
				value={color}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						color: e.currentTarget.value,
					})
				}}
			/>
			<input
				value={name}
				onChange={(e) => {
					editor.user.updateUserPreferences({
						name: e.currentTarget.value,
					})
				}}
			/>
			
		</div>
	)
})

export default App
