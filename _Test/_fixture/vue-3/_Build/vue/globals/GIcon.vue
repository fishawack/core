<template>
	<div class="icon">
		<GSvg
			:name="name"
			:embed="embed"
			:asis="asis"
		/>
	</div>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				required: true,
			},
			embed: {
				type: Boolean,
				default: false,
			},
			asis: {
				type: Boolean,
				default: false,
			}
		}
	}
</script>