<template functional>
	<div
		v-if="props.embed"
		v-html="require(`../../handlebars/generated/embed/svg${props.asis ? '--asis' : ''}--${props.name}.svg`)"
		:class="[data.class,data.staticClass]"
	/>

	<svg
		v-else
		:class="[data.class,data.staticClass]"
	>
		<use :xlink:href="'#' + props.name"/>
	</svg>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				required: true
			},
			embed: {
				type: Boolean,
				default: false,
			},
			asis: {
				type: Boolean,
				default: false,
			},
		}
	}
</script>