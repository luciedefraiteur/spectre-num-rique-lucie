export class ResultAggregator {
    results = [];
    add(feedback) {
        this.results.push(feedback);
    }
    all() {
        return this.results;
    }
    successes() {
        return this.results.filter(r => r.status === 'success');
    }
    errors() {
        return this.results.filter(r => r.status === 'error');
    }
    stubbed() {
        return this.results.filter(r => r.status === 'stubbed');
    }
}
//# sourceMappingURL=batch_editor_types.js.map