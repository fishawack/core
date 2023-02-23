<template functional>
	<div
        class="icon"
        :class="[data.class,data.staticClass]"
    >
		<GSvg
			:name="props.name"
			:embed="props.embed"
			:asis="props.asis"
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