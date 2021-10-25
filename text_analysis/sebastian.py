# Sebastian handles modeling.


class Sebastian:

    def __init__(self):
        self.feature_dict = None

    def get_params(self, dict):
        '''
        Formats the .best_params_ attribute of sklearn's models into a format
        that can be easily copy pasted onto the functions themselves.
        '''
        from re import match
        params = {}
        pattern = r'^([a-zA-Z0-9_]+)__([a-zA-Z0-9_]+)'
        for k, v in dict.items():
            # Puts quotes on string argument values.
            if isinstance(v, str):
                v = "'" + v + "'"
            # Checks if params are from a pipeline.
            try:
                m = match(pattern, k)
                key = m.group(1)
                kwarg = f'{m.group(2)}={v}'
            # For non pipeline params.
            except AttributeError:
                key = 'model args'
                kwarg = f'{k}={v}'
            # Populates dictionary with step: params.
            if key in params:
                params[key].append(kwarg)
            else:
                params[key] = [kwarg]
        # Turns dictionary into string for easy copy paste.
        s = ''
        for k, v in params.items():
            joined_list = ', '.join(map(str, v))
            s += f'{k}: {joined_list} '
        return s.strip(' ')

    def get_features(self, X_train, feature_importances_, order=None):
        '''
        Takes the train DataFrame and the .feature_importances_ attribute of
        sklearn's model and returns a sorted dictionary of feature_names:
        feature_importance for easy interpretation.
        '''
        # Creates feature dict of features with non zero importances.
        feature_dict = {}
        for i, v in enumerate(feature_importances_):
            if v != 0:
                feature_dict[X_train.columns[i]] = v
        # Sorts dict from most important feature to least.
        if order == 'dsc':
            sorted_features = sorted(
                feature_dict, key=feature_dict.__getitem__, reverse=True)
            sorted_values = sorted(feature_dict.values(), reverse=True)
            sorted_feature_dict = {k: v for k, v in zip(
                sorted_features, sorted_values)}
        elif order == 'asc':
            sorted_features = sorted(
                feature_dict, key=feature_dict.__getitem__, reverse=False)
            sorted_values = sorted(feature_dict.values(), reverse=False)
            sorted_feature_dict = {k: v for k, v in zip(
                sorted_features, sorted_values)}
        elif order == 'abs':
            feature_dict = {k: abs(v) for k, v in feature_dict.items()}
            sorted_features = sorted(
                feature_dict, key=feature_dict.__getitem__, reverse=True)
            sorted_values = sorted(feature_dict.values(), reverse=True)
            sorted_feature_dict = {k: v for k, v in zip(
                sorted_features, sorted_values)}
        else:
            sorted_feature_dict = feature_dict
        self.feature_dict = sorted_feature_dict
        return sorted_feature_dict

    def plot_importances(self, X_train=None, feature_importances_=None, max_features=10, order='dsc', fontsize=10, title=None, **kwargs):
        '''
        Takes the train DataFrame and the .feature_importances_ attribute of
        sklearn's model and plots a horizontal bar graph of the 10 most
        important features and their importances.

        Can be called without any arguments if get_features() was called
        beforehand.

        params:
            max_features    determines the number of features plotted. The
                            default is 10.
            order           'des' plots features with the highest importances.
                            'asc' plots features with the lowest importances.
                            This can be useful if importances have -ve values.
                            'abs' takes the absolute value of feature
                            importances before plotting those with the highest
                            values.
        '''
        import matplotlib.pyplot as plt
        # Allows the function to be called after get_features with no
        # arguments.
        if X_train is None or feature_importances_ is None:
            if self.get_features is None:
                raise TypeError(
                    'missing "X_train" or "feature_importances_" arguments.')
            else:
                feature_dict = self.feature_dict
        else:
            feature_dict = self.get_features(
                X_train, feature_importances_, sort=False)
            self.feature_dict = feature_dict
        # Arranges the graph from most important at the top to least at the
        # bottom.
        if order == 'dsc':
            sorted_features = sorted(
                feature_dict, key=feature_dict.__getitem__, reverse=True)
            sorted_values = sorted(feature_dict.values(), reverse=True)
            sorted_feature_dict = {k: v for k, v in zip(
                sorted_features, sorted_values)}
        elif order == 'asc':
            sorted_features = sorted(
                feature_dict, key=feature_dict.__getitem__, reverse=False)
            sorted_values = sorted(feature_dict.values(), reverse=False)
            sorted_feature_dict = {k: v for k, v in zip(
                sorted_features, sorted_values)}
        elif order == 'abs':
            feature_dict = {k: abs(v) for k, v in feature_dict.items()}
            sorted_features = sorted(
                feature_dict, key=feature_dict.__getitem__, reverse=True)
            sorted_values = sorted(feature_dict.values(), reverse=True)
            sorted_feature_dict = {k: v for k, v in zip(
                sorted_features, sorted_values)}
        else:
            raise Exception('unrecognized order.')
        features = list(sorted_feature_dict.keys())
        importances = list(sorted_feature_dict.values())
        # Limits number of features shown.
        features = features[:max_features]
        importances = importances[:max_features]
        # Arranges most important feature at top instead of bottom.
        features.reverse()
        importances.reverse()
        fig, ax = plt.subplots(**kwargs)
        ax.barh(range(len(features)), importances, align='center')
        ax.set_yticks(range(len(features)))
        ax.set_yticklabels(features)
        ax.set_title(title)
        plt.rc('font', size=fontsize)
        plt.show()
        plt.close()
