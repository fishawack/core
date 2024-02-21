<template>
	<div
		v-if="embed"
		v-html="require(`../../handlebars/generated/embed/svg${asis ? '--asis' : ''}--${name}.svg`)"
	/>
	<svg v-else>
		<use :xlink:href="'#' + name"/>
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